<script lang="ts">
    import type { StaticDataProfessionCategory } from '@/types/data/static'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let knownRecipes: Set<number>
    export let category: StaticDataProfessionCategory

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

{#if category.abilities.length > 0}
    <table class="table table-striped" data-category-id={category.id}>
        <thead>
            <tr>
                <th class="category-name">{category.name}</th>
                <th class="trivial"></th>
                <th class="trivial"></th>
                <th class="trivial"></th>
            </tr>
        </thead>
        <tbody>
            {#each category.abilities as ability}
                {@const userHas=knownRecipes.has(ability.id)}
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
                            id={ability.spellId}
                            type={"spell"}
                        >
                            <WowthingImage
                                name={ability.itemId ? `item/${ability.itemId}` : `spell/${ability.spellId}`}
                                size={20}
                                border={1}
                            />
                            <ParsedText text={getFixedName(ability.name)} />
                        </WowheadLink>
                    </td>
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
