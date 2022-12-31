<script lang="ts">
    import some from 'lodash/some'

    import { iconStrings } from '@/data/icons'
    import type { StaticDataProfessionAbility, StaticDataProfessionCategory } from '@/types/data/static'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let knownRecipes: Set<number>
    export let category: StaticDataProfessionCategory

    let abilities: [StaticDataProfessionAbility, boolean, number, number, number][]
    let hasRanks: boolean
    $: {
        abilities = []
        hasRanks = false
        for (const ability of (category.abilities || [])) {
            let has = false
            let spellId = ability.spellId
            let currentRank = 1
            let totalRanks = 1

            if (ability.extraRanks) {
                totalRanks = 1 + ability.extraRanks.length
                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    const [rankAbilityId, rankSpellId] = ability.extraRanks[rankIndex]
                    if (knownRecipes.has(rankAbilityId)) {
                        has = true
                        hasRanks = true
                        currentRank = rankIndex + 2
                        spellId = rankSpellId
                        break
                    }
                }
                if (!has && knownRecipes.has(ability.id)) {
                    has = true
                }
            }
            else {
                if (knownRecipes.has(ability.id)) {
                    has = true
                }
            }

            abilities.push([
                ability,
                has,
                spellId,
                currentRank,
                totalRanks
            ])
        }
    }

    const getFixedName = function(name: string): string {
        name = name.replace(/(- )?\|A:Professions-Icon-Quality-Tier\d-Small:20:20\|a/, ':starFull:')
        return name
    }
</script>

<style lang="scss">
    table {
        break-inside: avoid;
        margin-bottom: 1rem;
        //overflow: hidden; /* Firefox fix */
        width: 100%;
    }
    td {
        padding: 0.2rem 0.4rem;
    }
    thead {
        tr {
            th {
                background: $highlight-background;
                font-weight: normal;
                padding: 0.2rem 0.4rem;
                text-align: left;
            }
        }
    }
    .ability-name {
        --image-border-width: 1px;
        --image-margin-top: -2px;

        width: 100%;

        :global(img) {
            margin-right: 0.1rem;
        }
    }
    .tier2 {
        :global(span[data-string="starFull"]) {
            color: rgb(215, 215, 215);
        }
    }
    .tier3 {
        :global(span[data-string="starFull"]) {
            color: rgb(255, 215, 0);
        }
    }
    .ranks {
        --scale: 0.9;

        padding-left: 0;
        text-align: right;
        width: 4.5rem;

        :global(a + a) {
            margin-left: -0.5rem;
        }
    }
    .trivial {
        padding-left: 0;
        text-align: right;
        width: 2.2rem;
    }
    .trivial-low {
        color: $colour-shrug;
    }
    .trivial-mid {
        color: $colour-success;
    }
    .trivial-high {
        color: #bbb;
    }
</style>

{#if abilities.length > 0}
    <table class="table table-striped" data-category-id={category.id}>
        <thead>
            <tr>
                <th class="category-name">{category.name}</th>
                {#if hasRanks}
                    <th class="ranks"></th>
                {/if}
                <th class="trivial"></th>
                <th class="trivial"></th>
                <th class="trivial"></th>
            </tr>
        </thead>
        <tbody>
            {#each abilities as [ability, userHas, spellId, currentRank, totalRanks]}
                {@const useLow=ability.trivialLow && ability.trivialLow < ability.trivialHigh}
                <tr data-ability-id={ability.id}>
                    <td
                        class="ability-name text-overflow"
                        class:status-success={userHas}
                        class:status-fail={!userHas}
                        class:tier2={ability.name.includes('Tier2')}
                        class:tier3={ability.name.includes('Tier3')}
                    >
                        <WowheadLink
                            id={spellId}
                            type={"spell"}
                        >
                            <WowthingImage
                                name={ability.itemId ? `item/${ability.itemId}` : `spell/${spellId}`}
                                size={20}
                                border={1}
                            />

                            <ParsedText text={getFixedName(ability.name)} />
                        </WowheadLink>
                    </td>
                    
                    {#if hasRanks}
                        <td
                            class="ranks"
                            class:status-success={userHas && currentRank === totalRanks}
                            class:status-shrug={userHas && currentRank < totalRanks}
                            class:status-fail={!userHas}
                        >
                            {#if totalRanks > 1}
                                {#each Array(3) as _, index}
                                    <WowheadLink
                                        id={index === 0 ? ability.spellId : ability.extraRanks[index - 1][1]}
                                        type={"spell"}
                                    >
                                        <IconifyIcon
                                            icon={iconStrings[index < currentRank && userHas ? 'starFull' : 'starEmpty']}
                                        />
                                    </WowheadLink>
                                {/each}
                            {/if}
                        </td>
                    {/if}

                    <td class="trivial trivial-low">
                        {#if useLow}
                            {ability.trivialLow}
                        {/if}
                    </td>
                    <td class="trivial trivial-mid">
                        {#if useLow}
                            {Math.floor((ability.trivialLow + ability.trivialHigh) / 2)}
                        {/if}
                    </td>
                    <td class="trivial trivial-high">
                        {#if ability.trivialHigh > 1}
                            {ability.trivialHigh}
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
