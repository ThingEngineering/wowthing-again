export function getEnchantmentText(id: number, text: string): string {
    if (!text) {
        return `Enchant #${id}`
    }

    // Bracer T3
    if ([6574, 6580, 6586].indexOf(id) >= 0) {
        text = text.replace('$k1', '200')
    }
    // Legs: agi/str + sta T2
    else if ([6489].indexOf(id) >= 0) {
        text = text.replace('$k1', '111').replace('$k2', '151')
    }
    // Legs: agi/str + sta T3
    else if ([6490].indexOf(id) >= 0) {
        text = text.replace('$k1', '131').replace('$k2', '171')
    }
    // Legs: int + sta T2
    else if ([6540].indexOf(id) >= 0) {
        text = text.replace('$k1', '151').replace('$k2', '111')
    }
    // Legs: int + sta T3
    else if ([6541].indexOf(id) >= 0) {
        text = text.replace('$k1', '171').replace('$k2', '131')
    }
    // Legs: int + mana T2
    else if ([6543].indexOf(id) >= 0) {
        text = text.replace('$k1', '151').replace('$387303s1', '4')
    }
    // Legs: int + mana T3
    else if ([6544].indexOf(id) >= 0) {
        text = text.replace('$k1', '177').replace('$387306s1', '5')
    }
    // Ring T2
    else if ([6549, 6555, 6561, 6567].indexOf(id) >= 0) {
        text = text.replace('$k1', '73')
    }
    // Ring T3
    else if ([6550, 6556, 6562, 6568].indexOf(id) >= 0) {
        text = text.replace('$k1', '82')
    }
    else if (id === 7052) {
        return text.replace(/^\|cnITEM_EPIC_COLOR:(.+)\|r$/, '$1')
    }

    return text
}
