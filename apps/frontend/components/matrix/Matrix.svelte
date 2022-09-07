<script lang="ts">
    import { filter } from 'lodash'
    import groupBy from 'lodash/groupBy'
    import some from 'lodash/some'
    import sortBy from 'lodash/sortBy'
    import xor from 'lodash/xor'

    import { classOrder } from '@/data/character-class'
    import { Constants } from '@/data/constants'
    import { staticStore, userStore } from '@/stores'
    import { matrixState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'
    import { Faction, factionValues, Gender, genderValues } from '@/types/enums'
    import { cartesianProduct } from '@/utils/cartesian-product'
    import { getGenderedName } from '@/utils/get-gendered-name'
    import type { Character } from '@/types'

    import CovenantIcon from '@/components/images/CovenantIcon.svelte'
    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'
    import NumberInput from '@/components/forms/NumberInput.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    let matrix: Record<string, Character[]>
    let xEntries: string[][]
    let xKeys: string[]
    let yEntries: string[][]
    let yKeys: string[]
    $: {
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
                        filter(
                            $userStore.data.characters,
                            (char) => $settings.characters.hiddenCharacters.indexOf(char.id) === -1 &&
                                char.level >= $matrixState.minLevel
                        ),
                        (char) => {
                            const parts: any[] = []

                            parts.push(allAxis.indexOf('account') >= 0
                                ? $userStore.data.accounts[char.accountId].tag || char.accountId
                                : null)
                            
                            parts.push(allAxis.indexOf('faction') >= 0 ? char.faction : null)
                            parts.push(allAxis.indexOf('gender') >= 0 ? char.gender : null)
                            parts.push(allAxis.indexOf('race') >= 0 ? char.raceId : null)
                            parts.push(allAxis.indexOf('class') >= 0 ? char.classId : null)

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

        const combos: string[][] = []

        for (let i = 0; i < 2; i++) {
            const axis = i === 0 ? sortedX : sortedY

            //const axisCombos
                
            if (axis.indexOf('account') >= 0) {
                combos.push(sortBy(
                    Object.keys($userStore.data.accounts)
                        .map((accountId) => {
                            const tag = $userStore.data.accounts[parseInt(accountId)].tag || accountId
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
                combos.push(Object.keys($staticStore.data.characterRaces)
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
        }

        xEntries = []
        xKeys = []
        yEntries = []
        yKeys = []

        const products = cartesianProduct(...combos)
        for (const product of products) {

            const xParts = product.slice(0, 5)
            const yParts = product.slice(5, 10)

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
    }

    const axisOptions: [string, string][] = [
        ['account', 'Account'],
        ['class', 'Class'],
        ['faction', 'Faction'],
        ['gender', 'Gender'],
        ['race', 'Race'],
    ]
    const axisOrder = axisOptions.map(([key,]) => key)

    const mergeKeys = (xKey: string, yKey: string): string => {
        const xParts = xKey.split(',')
        const yParts = yKey.split(',')
        for (let index = 0; index < xParts.length; index++) {
            if (yParts[index]) {
                xParts[index] = yParts[index]
            }
        }
        return xParts.join(',')
    }
</script>

<style lang="scss">
    .wrapper {
        align-items: start;
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
        @include cell-width(4rem);
    }
    .characters {
        @include cell-width(4rem);

        &.max-level {
            background: mix($thing-background, $colour-success, 90%);
        }
        &.no-characters {
            background: mix($thing-background, $colour-fail, 90%);
        }
    }
    .level {
        --image-margin-top: -4px;
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
            <span>Level >=</span>

            <NumberInput
                name="general_RefreshInterval"
                minValue={0}
                maxValue={Constants.characterMaxLevel}
                bind:value={$matrixState.minLevel}
            />
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
                    <td class="y-axis">
                        {#each yEntries[yIndex] as line}
                            <ParsedText text={line} />
                        {/each}
                    </td>
                    {#each xKeys as xKey}
                        {@const key = mergeKeys(xKey, yKey)}
                        {@const characters = matrix[key] || []}
                        <td
                            class="characters"
                            class:max-level={some(characters, (char) => char.level === Constants.characterMaxLevel)}
                            class:no-characters={characters.length === 0}
                        >
                            {#each characters as character}
                                <div class="level">
                                    {#if character.shadowlands?.covenantId}
                                        <CovenantIcon covenantId={character.shadowlands.covenantId} />
                                    {/if}
                                    {character.level}
                                </div>
                            {:else}
                                ---
                            {/each}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
