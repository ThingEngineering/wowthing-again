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
        column-count: var(--column-count, 1);
        gap: 30px;
    }
    .collection-v2-group {
        width: 18.1rem;
    }
</style>

<div class="collection thing-container">
    {#if category.name}
        <SectionTitle
            title={category.name}
            count={$userStatsStore.lookup(route)[`${slug1}--${category.slug}`]}
        />
    {/if}

    <div class="collection{useV2 ? '-v2' : ''}-section">
        {#each category.groups as group}
            <div
                class="collection{useV2 ? '-v2' : ''}-group"
                style={useV2 ? '' : `width: min(100%, calc((${group.things.length} * 44px) + (${group.things.length - 1} * 0.3rem)));`}
            >
                <h4
                    class="drop-shadow text-overflow {getPercentClass($userStatsStore.lookup(route)[`${slug1}--${category.slug}--${group.name}`])}"
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
