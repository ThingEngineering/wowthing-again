<script lang="ts">
    import find from 'lodash/find'

    import { lazyStore, manualStore, userQuestStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataCustomizationCategory } from '@/types/data/manual'

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';
    import getPercentClass from '@/utils/get-percent-class';

    export let params: MultiSlugParams

    let category: ManualDataCustomizationCategory
    $: {
        const categories = find($manualStore.customizationCategories, (c) => c !== null && c[0].slug === params.slug1)
        if (!categories) { break $ }

        category = find(categories, (c) => c !== null && c.slug === params.slug2)
        if (!category) { break $ }
        
        console.log(category)
    }
</script>

<style lang="scss">
    table {
        --image-margin-top: -4px;
        --scale: 0.9;
    }
    table + table {
        margin-top: 1rem;
    }
    .group-name {
        padding-left: 0.4rem;
    }
    .group-stats {
        font-size: 90%;
        padding-right: 0.4rem;
        text-align: right;
        word-spacing: -0.2ch;
    }
    .faded {
        opacity: 0.6;
    }
    .name {
        @include cell-width(13rem);

        white-space: nowrap;
    }
    .item {
        @include cell-width(20rem);

        white-space: nowrap;
    }
</style>

{#if category}
    <div class="blah">
        {#each category.groups as group}
            {@const groupStats = $lazyStore.customizations[`${params.slug1}--${params.slug2}--${group.name}`]}
            {@const color = getPercentClass(groupStats.percent)}
            <table class="table table-striped">
                <thead>
                    <tr>
                        <td colspan="2" class="group-name {color}">
                            {group.name}
                        </td>
                        <td class="group-stats">
                            {groupStats.have}
                            /
                            {groupStats.total}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {#each group.things as thing}
                        {@const have = $userQuestStore.accountHas.has(thing.questId)}
                        <tr
                            class:faded={have}
                        >
                            <td class="yes-no">
                                <YesNoIcon
                                    state={have}
                                    useStatusColors={true}
                                />
                            </td>
                            <td class="name text-overflow">
                                {thing.name}
                            </td>
                            <td class="item text-overflow">
                                <WowheadLink
                                    id={thing.itemId}
                                    type={'item'}
                                >
                                    <ParsedText text={`{item:${thing.itemId}}`} />
                                </WowheadLink>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/each}
    </div>
{/if}
