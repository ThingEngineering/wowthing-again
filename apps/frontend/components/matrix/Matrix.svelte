<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import some from 'lodash/some'
    import sortBy from 'lodash/sortBy'
    import xor from 'lodash/xor'

    import { classOrder } from '@/data/character-class'
    import { Constants } from '@/data/constants'
    import { isSecondaryProfession, professionOrder } from '@/data/professions'
    import { Gender, genderValues } from '@/enums/gender'
    import { Region } from '@/enums/region'
    import { settingsStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { matrixState } from '@/stores/local-storage'
    import { cartesianProduct } from '@/utils/cartesian-product'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'
    import type { StaticDataRealm } from '@/shared/stores/static/types'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import CovenantIcon from '@/shared/components/images/CovenantIcon.svelte'
    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte'
    import NumberInput from '@/shared/components/forms/NumberInput.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import RadioGroup from '@/shared/components/forms/RadioGroup.svelte'
    import TooltipCharacter from '@/components/tooltips/matrix-character/TooltipMatrixCharacter.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    let matrix: Record<string, Character[]>
    let xCounts: Record<string, number>
    let xEntries: string[][]
    let xKeys: string[]
    let yCounts: Record<string, number>
    let yEntries: string[][]
    let yKeys: string[]
    $: {
        const characters = $userStore.characters.filter(
            (char) => (
                $settingsStore.characters.hiddenCharacters.indexOf(char.id) === -1 &&
                $settingsStore.characters.ignoredCharacters.indexOf(char.id) === -1 &&
                char.level >= $matrixState.minLevel
            )
        )

        const realmMap: Record<number, StaticDataRealm> = {}
        for (const character of characters) {
            realmMap[character.realmId] = character.realm
        }

        const realms: [string, string, StaticDataRealm][] = Object.values(realmMap)
            .map((realm) => [
                Region[realm.region],
                $staticStore.connectedRealms[realm.connectedRealmId]?.displayText ||
                    `Realm #${realm.connectedRealmId}`,
                realm,
            ])
        //realms.sort()

        const sortedX = sortBy($matrixState.xAxis, (key) => axisOrder.indexOf(key))
        const sortedY = sortBy($matrixState.yAxis, (key) => axisOrder.indexOf(key))

        const allAxis = sortBy(
            [...$matrixState.xAxis, ...$matrixState.yAxis],
            (key) => axisOrder.indexOf(key)
        )
        
        matrix = Object.fromEntries(
            sortBy(
                Object.entries(
                    groupBy(
                        characters,
                        (char) => {
                            const parts: (number|string)[] = []

                            parts.push(allAxis.indexOf('realm') >= 0 ? char.realm.connectedRealmId : null)

                            parts.push(allAxis.indexOf('account') >= 0
                                ? $userStore.accounts[char.accountId].tag || char.accountId
                                : null)
                            
                            parts.push(allAxis.indexOf('faction') >= 0 ? char.faction : null)
                            parts.push(allAxis.indexOf('gender') >= 0 ? char.gender : null)
                            parts.push(allAxis.indexOf('race') >= 0 ? char.raceId : null)
                            parts.push(allAxis.indexOf('class') >= 0 ? char.classId : null)

                            const professionIds = Object.keys(char.professions || {})
                                .map((id) => parseInt(id))
                                .filter((professionId) => !isSecondaryProfession[professionId])
                            
                            parts.push(allAxis.indexOf('profession') >= 0 ? (professionIds[0] || null) : null)
                            parts.push(allAxis.indexOf('profession') >= 0 ? (professionIds[1] || null) : null)

                            return parts
                        }
                    ) 
                ).map(([key, characters]) => [
                    key,
                    sortBy(characters, (char) => -char.level),
                ]),
                ([key, ]) => key
            )
        )

        // unique ID|display text?
        const combos: string[][] = []

        for (let i = 0; i < 2; i++) {
            const axis = i === 0 ? sortedX : sortedY
                
            if (axis.indexOf('realm') >= 0) {
                combos.push(realms
                    .map(([region, displayText, realm]) => `${realm.connectedRealmId}|[${region}] ${displayText}`)
                )
            }
            else {
                combos.push([''])
            }

            if (axis.indexOf('account') >= 0) {
                combos.push(sortBy(
                    Object.keys($userStore.accounts)
                        .map((accountId) => {
                            const tag = $userStore.accounts[parseInt(accountId)].tag || accountId
                            return `${tag}|${tag}`
                        }),
                    (key) => key.split('|')[0]
                ))
            }
            else {
                combos.push([''])
            }

            if (axis.indexOf('faction') >= 0) {
                combos.push([':alliance:', ':horde:']
                    .map((faction, index) => `${index}|${faction}`)
                )
            }
            else {
                combos.push([''])
            }

            if (axis.indexOf('gender') >= 0) {
                combos.push(genderValues
                    .map((gender) => `${gender}|${Gender[parseInt(gender)]}`)
                )
            }
            else {
                combos.push([''])
            }

            if (axis.indexOf('race') >= 0) {
                combos.push(Object.keys($staticStore.characterRaces)
                    .map((raceId) => `${raceId}|:race-${raceId}:`)
                )
            }
            else {
                combos.push([''])
            }

            if (axis.indexOf('class') >= 0) {
                combos.push(classOrder
                    .map((classId) => `${classId}|:class-${classId}:`)
                )
            }
            else {
                combos.push([''])
            }

            if (axis.indexOf('profession') >= 0) {
                combos.push(professionOrder
                    .map((professionId) => `${professionId}|:profession-${professionId}:`))
            }
            else {
                combos.push([''])
            }
        }

        xEntries = []
        xKeys = []
        yEntries = []
        yKeys = []

        const products = cartesianProduct(...combos)

        for (const product of products) {
            const xParts = product.slice(0, product.length / 2)
            const yParts = product.slice(product.length / 2, product.length)

            // console.log(xParts, yParts)

            if (xParts.length > 0) {
                const xSplit = xParts.map((s) => s.split('|'))

                const xKey = xSplit.map((parts) => parts[0]).join(',')
                if (!some(xKeys, (key) => key === xKey)) {
                    xKeys.push(xKey)
                }

                const xEntry = xSplit.map((parts) => parts[1] || '')
                if (!some(xEntries, (entry) => xor(entry, xEntry).length === 0)) {
                    xEntries.push(xEntry)
                }
            }
            if (yParts.length > 0) {
                const ySplit = yParts.map((s) => s.split('|'))

                const yKey = ySplit.map((parts) => parts[0]).join(',')
                if (!some(yKeys, (key) => key === yKey)) {
                    yKeys.push(yKey)
                }

                const yEntry = ySplit.map((parts) => parts[1] || '')
                if (!some(yEntries, (entry) => xor(entry, yEntry).length === 0)) {
                    yEntries.push(yEntry)
                }
            }
        }

        // console.log('x', xKeys, xEntries)
        // console.log('y', yKeys, yEntries)

        if (xEntries.length === 1 && !some(xEntries[0], (x) => x !== '')) {
            xEntries[0] = ['All']
            //xKeys.push('')
        }

        if (yEntries.length === 1 && !some(yEntries[0], (y) => y !== '')) {
            yEntries[0] = ['All']
        }

        // Counts
        xCounts = {}
        yCounts = {}
        for (const yKey of yKeys) {
            for (const xKey of xKeys) {
                const keyCharacters = getCharacters(xKey, yKey)
                xCounts[xKey] = (xCounts[xKey] || 0) + keyCharacters.length
                yCounts[yKey] = (yCounts[yKey] || 0) + keyCharacters.length
            }
        }
    }

    const axisOptions: [string, string][] = [
        ['account', 'Account'],
        ['faction', 'Faction'],
        ['realm', 'Realm'],
        ['class', 'Class'],
        ['gender', 'Gender'],
        ['race', 'Race'],
        ['profession', 'Profession'],
    ]
    const axisOrder = axisOptions.map(([key,]) => key)

    // const mergeKeys = (xKey: string, yKey: string): string => {
    //     const xParts = xKey.split(',')
    //     const yParts = yKey.split(',')
    //     for (let index = 0; index < xParts.length; index++) {
    //         if (yParts[index]) {
    //             xParts[index] = yParts[index]
    //         }
    //     }
    //     return xParts.join(',')
    // }

    const regexCache: Record<string, RegExp> = {}
    const getCharacters = (xKey: string, yKey: string): Character[] => {
        // merge the keys into a single string
        const xParts = xKey.split(',')
        const yParts = yKey.split(',')
        for (let index = 0; index < xParts.length; index++) {
            if (yParts[index]) {
                xParts[index] = yParts[index]
            }
        }

        // professions, oof
        if (xParts[xParts.length - 1]) {
            const re1 = [...xParts, '\\d*'].join(',')
            const re2 = [...xParts.slice(0, -1), '\\d*', xParts[xParts.length - 1]].join(',')

            const match1 = regexCache[re1] ||= new RegExp(re1)
            const match2 = regexCache[re2] ||= new RegExp(re2)

            const characters: Character[] = []
            for (const key in matrix) {
                if (key.match(match1) || key.match(match2)) {
                    characters.push(...matrix[key])
                }
            }
            return characters
        }
        else {
            xParts.push('')
            return matrix[xParts.join(',')] || []
        }
    }
</script>

<style lang="scss">
    .wrapper {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        //width: 100%;
    }
    .options-wrapper {
        display: flex;
        gap: 0.5rem 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
    }
    .options-container {
        margin-bottom: 0;
        padding: 0.2rem 0.3rem;

        :global(input) {
            margin-top: 0;
            padding-bottom: 0;
            padding-top: 0;
        }
    }
    table {
        --image-border-width: 1px;
    }
    td {
        border: 1px solid $border-color;
        padding: 0.3rem 0.6rem 0.4rem 0.6rem;
        text-align: center;

        :global(span) {
            display: block;
            margin-top: 0.1rem;
        }
        /*:global(img) {
            transform: scale(1.2);
        }*/
    }
    .y-axis {
        @include cell-width(4rem, $maxWidth: 10rem);
    }
    .characters {
        white-space: nowrap;
        &.as-level {
            @include cell-width(2.5rem);
        }
        &.as-name {
            @include cell-width(6rem);
        }
        &.max-level {
            background: mix($thing-background, $colour-success, 90%);
        }
        &.no-characters {
            background: mix($thing-background, $colour-fail, 90%);
        }
    }
    .character {
        --image-margin-top: -4px;

        a {
            color: var(--colour-class, inherit);
        }
    }
    .counts {
        color: #44ffff;
    }
</style>

<div class="wrapper">
    <UnderConstruction />

    <div class="options-wrapper">
        <div class="options-container background-box">
            <span>X axis:</span>

            {#each axisOptions as [value, label]}
                <GroupedCheckbox
                    name="x_{value}"
                    disabled={$matrixState.yAxis.indexOf(value) >= 0}
                    {value}
                    bind:bindGroup={$matrixState.xAxis}
                >{label}</GroupedCheckbox>
            {/each}
        </div>

        <div class="options-container background-box">
            <span>Y axis:</span>

            {#each axisOptions as [value, label]}
                <GroupedCheckbox
                    name="y_{value}"
                    disabled={$matrixState.xAxis.indexOf(value) >= 0}
                    {value}
                    bind:bindGroup={$matrixState.yAxis}
                >{label}</GroupedCheckbox>
            {/each}
        </div>

        <div class="options-container background-box">
            <span>Level &gt;=</span>

            <NumberInput
                name="min_level"
                minValue={0}
                maxValue={Constants.characterMaxLevel}
                bind:value={$matrixState.minLevel}
            />
        </div>

        <div class="options-container background-box">
            Show as:&nbsp;
            <RadioGroup
                name="show_character_as"
                bind:value={$matrixState.showCharacterAs}
                options={[
                    ['level', 'Level'],
                    ['name', 'Name'],
                ]}
            />
        </div>

        <div class="options-container background-box">
            <CheckboxInput
                name="show_covenant"
                bind:value={$matrixState.showCovenant}
            >
                Show Covenant
            </CheckboxInput>
        </div>
    </div>

    <table class="table table-striped">
        <thead>
            <tr>
                <td></td>
                {#each xEntries as lines}
                    <td class="x-axis">
                        {#each lines as line}
                            <ParsedText text={line} />
                        {/each}
                    </td>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each yKeys as yKey, yIndex}
                <tr>
                    <td class="y-axis text-overflow">
                        {#each yEntries[yIndex] as line}
                            <ParsedText text={line} />
                        {/each}
                    </td>
                    {#each xKeys as xKey}
                        {@const keyCharacters = getCharacters(xKey, yKey)}
                        <td
                            class="characters as-{$matrixState.showCharacterAs}"
                            class:max-level={some(keyCharacters, (char) => char.level === Constants.characterMaxLevel)}
                            class:no-characters={keyCharacters.length === 0}
                        >
                            {#each keyCharacters as character}
                                <div
                                    class="character"
                                    use:componentTooltip={{
                                        component: TooltipCharacter,
                                        props: {
                                            character,
                                        },
                                    }}
                                >
                                    {#if $matrixState.showCovenant && character.shadowlands?.covenantId}
                                        <CovenantIcon covenantId={character.shadowlands.covenantId} />
                                    {/if}
                                    {#if $matrixState.showCharacterAs === 'level'}
                                        {character.level}
                                    {:else}
                                        <a
                                            class="class-{character.classId} drop-shadow"
                                            href="#/characters/{Region[character.realm.region].toLocaleLowerCase()}-{character.realm.slug}/{character.name}"
                                        >
                                            {character.name}
                                        </a>
                                    {/if}
                                </div>
                            {:else}
                                ---
                            {/each}
                        </td>
                    {/each}
                    <td class="counts">{yCounts[yKey]}</td>
                </tr>
            {/each}
            <tr>
                <td></td>
                {#each xKeys as xKey}
                    <td class="counts">{xCounts[xKey]}</td>
                {/each}
                <td>{Object.values(xCounts).reduce((a, b) => a + b, 0)}</td>
            </tr>
        </tbody>
    </table>
</div>
