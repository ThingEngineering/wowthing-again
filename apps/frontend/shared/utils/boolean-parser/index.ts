// Boolean-parser.js
// -----------------
// License: MIT
// More information on what this does, and how the whole library works can be
// found in the README.md or on the github page.
// https://github.com/riichard/boolean-parser-js/blob/master/README.md

// Return true if arrays are equal
function _arraysAreEqual(arrA: string[], arrB: string[]): boolean {
  if (!Array.isArray(arrA) || !Array.isArray(arrB))
  {
    throw new TypeError("both parameters have to be an array")
  }
    
  if (arrA.length !== arrB.length)
  {
    return false
  }

  for (let i = 0; i < arrA.length; i++) {
    // No deep equal necessary
    if (arrA[i] !== arrB[i]){
      return false
    }
  }

  return true
}
  
export function parseBooleanQuery(searchPhrase: string): string[][] {
  searchPhrase = escapeCharactersInQuotes(searchPhrase)
  const permutations = _parseBooleanQuery(searchPhrase) || []
  const unescaped = unescapeCharactersInQuotes(permutations)
  return deduplicateOr(unescaped)
}

function injectOperatorBetweenTerms(searchPhrase: string): string {
  // Remove leading and trailing whitespace
  searchPhrase = searchPhrase.trim()

  // replace all spaces with ' AND ', then remove any extra ANDs
  searchPhrase = searchPhrase.replace(/ /gi, ' AND ')
  searchPhrase = searchPhrase.replace(/ AND AND AND /gi, ' AND ')
  searchPhrase = searchPhrase.replace(/ AND OR AND /gi, ' OR ')
  searchPhrase = searchPhrase.replace(/\( AND /gi, '(')
  searchPhrase = searchPhrase.replace(/ AND \)/gi, ')')

  return searchPhrase
}

function escapeCharactersInQuotes(searchPhrase: string): string {
  searchPhrase = searchPhrase.replace(/(".+?")/g, function(match, group1, offset, input_string) {
    // remove spaces
    let encoded = encodeURI(group1.trim())
    // remove parenthesis
    encoded = encoded.replace(/\(/g, '&#40;')
    encoded = encoded.replace(/\)/g, '&#41;')
    return encoded
  })
  return searchPhrase
}

function unescapeCharactersInQuotes(permutations: string[][]): string[][] {
  const decodedPermutations: string[][] = []

  permutations.forEach(function(element){
      const decodedElement: string[] = []
      element.forEach(function(term) {
        // restore parenthesis that may have been encoded
        let decoded = term.replace(/&#40;/g, '(')
        decoded = decoded.replace(/&#41;/g, ')')
        // restore spaces that may have been encoded
        decoded = decodeURI(decoded)
        
        // strip off quotes 
        decoded = decoded.replace(/^"(.*)"$/, function(match, group1, offset, original){ 
          return group1; 
        })
        decodedElement.push(decoded)
      })
      decodedPermutations.push(decodedElement)
  })
  return decodedPermutations
}

// This function converts a boolean query to a 2 dimensional array.
// a AND (b OR c)
// Becomes:
// [[a, b],[a,c]]
// This works recursively and generates an array of all possible combination
// of a matching query.
// The output is meant to be easily parsed to see if there are any matches.
// There are more efficient ways to match content to this query, though this is
// the one that is most easy to maintain and limits risk of side-effects.
// Especially when considering recursively nested queries.
function _parseBooleanQuery(searchPhrase: string): string[][] {
  // Remove outer brackets if they exist. EX: (a OR b) -> a OR b
  searchPhrase = removeOuterBrackets(searchPhrase)

  // remove double whitespaces
  searchPhrase = removeDoubleWhiteSpace(searchPhrase)

  // Put ANDs inbetween all the terms that only have a space betwee them
  searchPhrase = injectOperatorBetweenTerms(searchPhrase)

  // Split the phrase on the term 'OR', but don't do this on 'OR' that's in
  // between brackets. EX: a OR (b OR c) should not parse the `OR` in between b
  // and c.
  const ors = splitRoot('OR', searchPhrase)

  // Each parsed string returns a parsed array in this map function.
  const orPath = ors.map(function(andQuery) {
    // Split on the word 'AND'. Yet again, don't split `AND` that's written in
    // between brackets. We'll parse those later recursively.
    const ands = splitRoot('AND', andQuery)

    // All nested parsed queries will be stored in `nestedPaths`.
    // Nested means 'in between brackets'.
    const nestedPaths = []

    // All that's not nested will be stored in the andPath array.
    // This array contains words that will later be merged with the parsed
    // queries from nestedPaths.
    const andPath = []

    // Iterate trough all the strings from the AND query
    for (const andString of ands) {
      // If the string contains brackets, parse it recursively, and add it to
      // `nestedPaths`.
      if (containsBrackets(andString)) {
        nestedPaths.push(_parseBooleanQuery(andString))
      }

      // If it doesn't. Push the word to `andPath`.
      else {
        andPath.push(andString)
      }
    }

    // Merge the andPath and the nested OR paths together as one `AND` path
    nestedPaths.push([andPath])

    // Merge all `ANDs` and `ORs` together in one OR query
    return orsAndMerge(nestedPaths)
  })

  // Merge all OR query paths together into one Array.
  return mergeOrs(orPath)
}

// Removes double whitespace in a string
// In: a b  c\nd\te
// Out: a b c d e
function removeDoubleWhiteSpace(phrase: string): string {
  return phrase.replace(/[\s]+/g, ' ')
}

// Merges 2 or paths together in an AND fashion
// in:
//  orPathA: [ [ a ], [ b ] ]
//  orPathB: [ [ c, d ], [ e ] ]
// out:
//  [
//    [ a, c, d ],
//    [ b, c, d],
//    [ a, e ],
//    [ b, e ]
//  ]
function orAndOrMerge(orPathA: string[][], orPathB: string[][]): string[][] {
  const result: string[][] = []
  orPathA.forEach(function(andPathA) {
    orPathB.forEach(function(andPathB) {
      result.push(andPathA.concat(andPathB))
    })
  })

  return result
}

// Merges multiple OR paths into one OR path, in an AND fashion
// in:
//  [
//    [ [ a ], [ b ] ],
//    [ [ c, d ], [ e ] ]
//    [ [ f ] ]
//  ]
// out:
//  [
//    [ a, c, d, f ],
//    [ b, c, d, f ],
//    [ a, e, f ],
//    [ b, e, f ]
//  ]
function orsAndMerge(ors: string[][][]): string[][] {
  let result: string[][] = [[]]
  
  for (const orString of ors) {
    result = orAndOrMerge(result, orString)
  }

  return result
}

// Removes duplicate and paths within an or path
// in:
//  [ [ a, b ], [ c ], [ b, a ] ]
// out:
//  [ [ a, b ], [ c ] ]
//
// with order matters
// in:
//  [ [ a, b ], [ c ], [ b, a ] ]
// out:
//  [ [ a, b ], [ c ], [ b, a ] ]
function deduplicateOr(orPath: string[][], orderMatters = false) {
  const path = orderMatters
    ? orPath
    : orPath.map((item) => item.sort() )

  return path.reduce(function(memo, current) {
    for (let i = 0; i < memo.length; i++) {
      if (_arraysAreEqual(memo[i], current)) {
        return memo
      }
    }
    memo.push(current)
    return memo
  }, [] as string[][])
}

// Merges an array of OR queries, containing AND queries to a single OR query
// In:
// [ [ [ a, b ], [ c ] ],
//   [ [ d ] ],
//   [ [ e ], [ f, g ] ] ]
// Out:
// [ [ a, b ], [ c ], [ d ], [ e ], [ f, g ] ]
function mergeOrs(ors: string[][][]): string[][] {
  let result = ors[0]

  for (const orArray of ors) {
    result = result.concat(orArray)
  }

  return result
}

// Removes the bracket at the beginning and end of a string. Only if they both
// exist. Otherwise it returns the original phrase.
// Ex: (a OR b) -> a OR b
// But yet doesn't remove the brackets when the last bracket isn't linked to
// the first bracket.
// Ex: (a OR b) AND (x OR y) -> (a OR b) AND (x OR y)
function removeOuterBrackets(phrase: string): string {
  // If the first character is a bracket
  if (phrase.charAt(0) === '(') {

    // Now we'll see if the closing bracket to the first character is the last
    // character. If so. Remove the brackets. Otherwise, leave it as it is.
    // We'll check that by incrementing the counter with every opening bracket,
    // and decrement it with each closing bracket.
    // When the counter hits 0. We are at the end bracket.
    let counter = 0
    for (let i = 0; i < phrase.length; i++) {
      // Increment the counter at each '('
      if (phrase.charAt(i) === '(') counter++

      // Decrement the counter at each ')'
      else if (phrase.charAt(i) === ')') counter--

      // If the counter is at 0, we are at the closing bracket.
      if (counter === 0) {
        // If we are not at the end of the sentence, Return the
        // phrase as-is without modifying it
        if (i !== phrase.length - 1) {
          return phrase
        }

        // If we are at the end, return the phrase without the surrounding brackets.
        else {
          return phrase.substring(1, phrase.length - 1)
        }
      }
    }
  }

  return phrase
}

// Returns boolean true when string contains brackets '(' or ')', at any
// position within the string
// Ex: (b AND c)  -> true
// Ex: b AND c    -> false
function containsBrackets(str: string): boolean {
  return !!~str.search(/\(|\)/)
}

// Splits a phrase into multiple strings by a split term. Like the split
// function.
// But then ignores the split terms that occur in between brackets
// Example when splitting on AND:
// In: a AND (b AND c)
// Out: ['a', '(b AND c)']
// We do this by using the built in 'split' function. But as soon as we notice
// our string contains brackets, we create a temporary string, append any
// folling string from the `split` results. And stop doing that when we counted
// as many opening brackets as closing brackets. Then append that string to the
// results as a single string.
function splitRoot(splitTerm: string, phrase: string): string[] {
  const termSplit = phrase.split(' ' + splitTerm + ' ')
  const result: string[] = []
  let tempNested: string[] = []
  for (let i = 0; i < termSplit.length; i++) {
    // If we are dealing with a split in a nested query,
    // add it to the tempNested array, and rebuild the incorrectly parsed nested query
    // later, by re-joining the array with the `splitTerm`, to make it look
    // like it's original state.
    if (containsBrackets(termSplit[i]) || tempNested.length > 0) {
      tempNested.push(termSplit[i])

      // When the tempNested contains just as much opening brackets as closing
      // brackets, we can declare it as 'complete'.
      const tempNestedString =  '' + tempNested
      const countOpeningBrackets = (tempNestedString.match(/\(/g) || []).length
      const countClosingBrackets = (tempNestedString.match(/\)/g) || []).length

      // If the amouth of opening brackets is the same as the amount of
      // closing brackets, then the string is complete.
      if (countOpeningBrackets === countClosingBrackets) {
        result.push(tempNested.join(' ' + splitTerm + ' '))

        // Clear the tempNested for the next round
        tempNested = []
      }
    }

    // In case we are NOT dealing with a nested query
    else {
      result.push(termSplit[i])
    }
  }

  return result
}

// Export all functions as a module
// module.exports = {
//   deduplicateOr: deduplicateOr,
//   andAndMerge: andAndMerge,
//   orAndOrMerge: orAndOrMerge,
//   orsAndMerge: orsAndMerge,
//   mergeOrs: mergeOrs,
//   splitRoot: splitRoot,
//   removeDoubleWhiteSpace: removeDoubleWhiteSpace,
//   removeOuterBrackets: removeOuterBrackets,
//   parseBooleanQuery: parseBooleanQuery,
//   containsBrackets: containsBrackets,
//   escapeCharactersInQuotes: escapeCharactersInQuotes,
//   unescapeCharactersInQuotes: unescapeCharactersInQuotes,
//   injectOperatorBetweenTerms: injectOperatorBetweenTerms,
//     defaultSplitTerm: 'AND'
// }
