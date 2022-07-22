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
    import { getGenderedName } from '@/utils/get-gendered-name'
    import type { Character } from '@/types'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import NumberInput from '@/components/forms/NumberInput.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    let matrix: Record<string, Character[]>
    let xEntries: string[][]
    let xKeys: string[]
    let yEntries: string[][]
    let yKeys: string[]
    $: {
        matrix = Object.fromEntries(
            sortBy(
                Object.entries(
                    groupBy(
                        filter(
                            $userStore.data.characters,
                            (char) => $settings.characters.hiddenCharacters.indexOf(char.id) === -1 &&
                                char.level >= $matrixState.minLevel
                        ),
                        (char) => [
                            $matrixState.x_class ? char.classId : null,
                            $matrixState.x_gender ? char.gender : null,
                            $matrixState.x_race ? char.raceId : null,

                            $matrixState.y_account ? $userStore.data.accounts[char.accountId].tag || char.accountId : null,
                            $matrixState.y_faction ? char.faction : null,
                        ]
                    )
                ).map(([key, characters]) => [
                    key,
                    sortBy(characters, (char) => -char.level),
                ]),
                ([key, ]) => {
                    const [classId, gender, raceId, accountId, faction] = key.split(',')

                    const parts: string[] = []

                    if (accountId !== '') {
                        parts.push(accountId)
                    }
                    if (faction) {
                        parts.push(faction)
                    }
                    if (gender) {
                        parts.push(gender)
                    }
                    if (raceId) {
                        parts.push(getGenderedName($staticStore.data.characterRaces[parseInt(raceId)].name, 0))
                    }
                    if (classId) {
                        parts.push(getGenderedName($staticStore.data.characterClasses[parseInt(classId)].name, 0))
                    }

                    return parts.join('|')
                }
            )
        )

        xEntries = []
        xKeys = []
        for (const classId of $matrixState.x_class ? classOrder.map((c) => c.toString()) : ['']) {
            for (const gender of $matrixState.x_gender ? genderValues : ['']) {
                for (const raceId of $matrixState.x_race ? Object.keys($staticStore.data.characterRaces) : ['']) {
                    xKeys.push(`${classId},${gender},${raceId}`)
                    
                    const xParts: string[] = []
                    if (gender) {
                        xParts.push(Gender[parseInt(gender)])
                    }
                    if (raceId) {
                        xParts.push(`:race-${raceId}:`)
                    }
                    if (classId) {
                        xParts.push(`:class-${classId}:`)
                    }

                    if (xParts.length > 0 && !some(xEntries, (entry) => xor(entry, xParts).length === 0)) {
                        xEntries.push(xParts)
                    }
                }
            }
        }
        if (xEntries.length === 0) {
            xEntries.push(['All'])
        }

        yEntries = []
        yKeys = []
        for (const faction of $matrixState.y_faction ? factionValues : ['']) {
            if (faction === '2' || faction === '10') {
                continue // neutral
            }

            for (const accountId of $matrixState.y_account ? Object.keys($userStore.data.accounts) : ['']) {
                yKeys.push(`${accountId},${faction}`)

                const yParts: string[] = []
                if (accountId) {
                    yParts.push(accountId)
                }
                if (faction) {
                    yParts.push(`:${Faction[parseInt(faction)].toLowerCase()}:`)
                }
                
                if (yParts.length > 0 && !some(yEntries, (entry) => xor(entry, yParts).length === 0)) {
                    yEntries.push(yParts)
                }
            }
        }
        if (yEntries.length === 0) {
            yEntries.push(['All'])
        }
    }
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
</style>

<div class="wrapper">
    <UnderConstruction />

    <div class="options-container">
        <span>X axis:</span>

        <button>
            <Checkbox
                name="y_gender"
                bind:value={$matrixState.x_gender}
                disabled={$matrixState.x_race && $matrixState.x_class}
            >Gender</Checkbox>
        </button>

        <button>
            <Checkbox
                name="y_race"
                bind:value={$matrixState.x_race}
                disabled={$matrixState.x_gender && $matrixState.x_class}
            >Race</Checkbox>
        </button>

        <button>
            <Checkbox
                name="y_class"
                bind:value={$matrixState.x_class}
                disabled={$matrixState.x_gender && $matrixState.x_race}
            >Class</Checkbox>
        </button>

        <span>Y axis:</span>

        <button>
            <Checkbox
                name="x_account"
                bind:value={$matrixState.y_account}
            >Account</Checkbox>
        </button>

        <button>
            <Checkbox
                name="x_faction"
                bind:value={$matrixState.y_faction}
            >Faction</Checkbox>
        </button>

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
                        {@const characters = matrix[`${xKey},${yKey}`] || []}
                        <td
                            class="characters"
                            class:max-level={some(characters, (char) => char.level === Constants.characterMaxLevel)}
                            class:no-characters={characters.length === 0}
                        >
                            {#each characters as character}
                                <div>{character.level}</div>
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
