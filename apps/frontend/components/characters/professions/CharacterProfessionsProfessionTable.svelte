<script lang="ts">
    import type { StaticDataProfessionCategory } from '@/types/data/static'

    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let knownRecipes: Set<number>
    export let category: StaticDataProfessionCategory
</script>

<style lang="scss">
    table {
        border-top: 1px solid $border-color;
        break-inside: avoid;
        margin-bottom: 1rem;
        //overflow: hidden; /* Firefox fix */
        width: 100%;
    }
    td {
        padding: 0.2rem 0.4rem;
    }
    .category-name {
        background: $highlight-background;
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
    }
    .ability-name {
        --image-border-width: 1px;
        --image-margin-top: -2px;

        width: 100%;

        :global(img) {
            margin-right: 0.1rem;
        }
    }
</style>

{#if category.abilities.length > 0}
    <table class="table table-striped">
        <tbody>
            <tr>
                <td class="category-name">{category.name}</td>
            </tr>

            {#each category.abilities as ability}
                {@const userHas=knownRecipes.has(ability.id)}
                <tr>
                    <td
                        class="ability-name"
                        class:status-success={userHas}
                        class:status-fail={!userHas}
                    >
                        <WowheadLink
                            id={ability.spellId}
                            type={"spell"}
                        >
                            <WowthingImage
                                name="spell/{ability.spellId}"
                                size={20}
                                border={1}
                            />
                            {ability.name}
                        </WowheadLink>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
