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

        const allAxis = [...sortedX, ...sortedY]
        
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
                            for (const key of allAxis) {
                                if (key === 'class') {
                                    parts.push(char.classId)
                                }
                                else if (key === 'gender') {
                                    parts.push(char.gender)
                                }
                                else if (key === 'race') {
                                    parts.push(char.raceId)
                                }
                                else if (key === 'account') {
                                    parts.push($userStore.data.accounts[char.accountId].tag || char.accountId)
                                }
                                else if (key === 'faction') {
                                    parts.push(char.faction)
                                }
                            }
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
            for (const key of axis) {
                if (key === 'account') {
                    combos.push(Object.keys($userStore.data.accounts)
                        .map((accountId) => `${i === 0 ? 'X' : 'Y'}|${accountId}|${accountId}`)
                    )
                }
                else if (key === 'faction') {
                    combos.push([':alliance:', ':horde:']
                        .map((faction, index) => `${i === 0 ? 'X' : 'Y'}|${index}|${faction}`)
                    )
                }
                else if (key === 'gender') {
                    combos.push(genderValues
                        .map((gender) => `${i === 0 ? 'X' : 'Y'}|${gender}|${Gender[parseInt(gender)]}`)
                    )
                }
                else if (key === 'race') {
                    combos.push(Object.keys($staticStore.data.characterRaces)
                        .map((raceId) => `${i === 0 ? 'X' : 'Y'}|${raceId}|:race-${raceId}:`)
                    )
                }
                else if (key === 'class') {
                    combos.push(classOrder
                        .map((classId) => `${i === 0 ? 'X' : 'Y'}|${classId}|:class-${classId}:`)
                    )
                }
            }
        }

        xEntries = []
        xKeys = []
        yEntries = []
        yKeys = []

        const products = cartesianProduct(...combos)
        for (const product of products.slice(0, 50)) {
            const xParts = product.filter((s) => s.startsWith('X'))
            const yParts = product.filter((s) => s.startsWith('Y'))

            if (xParts.length > 0) {
                const xSplit = xParts.map((s) => s.split('|'))

                const xKey = xSplit.map((parts) => parts[1]).join(',')
                if (!some(xKeys, (key) => key === xKey)) {
                    xKeys.push(xKey)
                }

                const xEntry = xSplit.map((parts) => parts[2])
                if (!some(xEntries, (entry) => xor(entry, xEntry).length === 0)) {
                    xEntries.push(xEntry)
                }
            }
            if (yParts.length > 0) {
                const ySplit = yParts.map((s) => s.split('|'))

                const yKey = ySplit.map((parts) => parts[1]).join(',')
                if (!some(yKeys, (key) => key === yKey)) {
                    yKeys.push(yKey)
                }

                const yEntry = ySplit.map((parts) => parts[2])
                if (!some(xEntries, (entry) => xor(entry, yEntry).length === 0)) {
                    yEntries.push(yEntry)
                }
            }
        }

        // console.log(xKeys, xEntries)
        // console.log(yKeys, yEntries)

        if (xEntries.length === 0) {
            xEntries.push(['All'])
            xKeys.push('')
        }

        if (yEntries.length === 0) {
            yEntries.push(['All'])
            yKeys.push('')
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
</script>

<style lang="scss">
    .wrapper {
        align-items: start;
        display: flex;
        flex-direction: column;
        //width: 100%;
    }
    .options-container {
        :global(input) {
            margin-top: 0;
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

    <div class="options-container">
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

    <div class="options-container">
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

    <div class="options-container">
        <span>Level >=</span>

        <NumberInput
            name="general_RefreshInterval"
            minValue={0}
            maxValue={Constants.characterMaxLevel}
            bind:value={$matrixState.minLevel}
        />
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
                        {@const key = `${xKey},${yKey}`.replace(/^,?(.*?),?$/, '$1')}
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
