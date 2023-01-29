<script lang="ts">
    import { userStatsStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import CollectibleThing from './CollectibleThing.svelte'
    import CollectibleThingPet from './CollectibleThingPet.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import SectionTitle from './CollectibleSectionTitle.svelte'

    export let category: ManualDataSetCategory
    export let route: string
    export let slug1: string
    export let thingType: string

    let useV2: boolean
    $: {
        useV2 = category.groups.length > 2 && category.groups.reduce((a, b) => a + b.things.length, 0) > 30
    }
</script>

<style lang="scss">
    .collection-v2-section {
        --column-count: 1;
        --column-gap: 1.25rem;
        --column-width: 18.75rem;

        width: 18.75rem;
        
        @media screen and (min-width: 1130px) {
            --column-count: 2;
            width: 39.5rem;
        }
        @media screen and (min-width: 1445px) {
            --column-count: 3;
            width: 59.5rem;
        }
        @media screen and (min-width: 1770px) {
            --column-count: 4;
            width: 79.5rem;
        }
    }
</style>

<div class="collection thing-container">
    {#if category.name}
        <SectionTitle
            title={category.name}
            count={$userStatsStore.counts[route][`${slug1}--${category.slug}`]}
        />
    {/if}

    <div class="collection{useV2 ? '-v2' : ''}-section">
        {#each category.groups as group}
            <div
                class="collection{useV2 ? '-v2' : ''}-group"
                style={useV2 ? '' : `width: min(100%, calc((${group.things.length} * 44px) + (${group.things.length - 1} * 0.3rem)));`}
            >
                <h4
                    class="drop-shadow text-overflow {getPercentClass($userStatsStore.counts[route][`${slug1}--${category.slug}--${group.name}`])}"
                    use:tippy={group.name}
                >
                    <ParsedText text={group.name} />
                </h4>

                <div class="collection-objects">
                    {#each group.things as things}
                        {#if thingType === 'npc'}
                            <CollectibleThingPet
                                {things}
                            />
                        {:else}
                            <CollectibleThing
                                {things}
                            />
                        {/if}
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
