<script lang="ts">
    import find from 'lodash/find'
    import { afterUpdate } from 'svelte'

    import { lazyStore, manualStore, userAchievementStore, userQuestStore } from '@/stores'
    import { collectibleState } from '@/stores/local-storage'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import getPercentClass from '@/utils/get-percent-class'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataCustomizationCategory } from '@/types/data/manual'

    import Options from './Options.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'

    export let params: MultiSlugParams

    let category: ManualDataCustomizationCategory
    $: {
        const categories = find($manualStore.customizationCategories, (c) => c !== null && c[0].slug === params.slug1)
        if (!categories) { break $ }

        category = find(categories, (c) => c !== null && c.slug === params.slug2)
        if (!category) { break $ }
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'table-striped',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '1.5rem'
                }
            )
            debouncedResize()
        }
        else {
            debouncedResize = null
        }
    }

    afterUpdate(() => debouncedResize?.())
</script>

<style lang="scss">
    .idk {
        columns: var(--column-count, 1);
    }
    table {
        --image-margin-top: -4px;
        --scale: 0.9;

        break-inside: avoid;
        overflow: hidden; /* Firefox fix */
        max-width: 35.5rem;
        min-width: 35.5rem;
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
    .yes-no {
        @include cell-width(1rem, $paddingLeft: 0px, $paddingRight: 0.5rem);
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

<svelte:window on:resize={debouncedResize} />

{#if category}
    <div class="resizer-view" bind:this={containerElement}>
        <Options />

        <div class="idk" bind:this={resizeableElement}>
            {#each category.groups as group}
                {@const groupStats = $lazyStore.customizations[`${params.slug1}--${params.slug2}--${group.name}`]}
                {@const color = getPercentClass(groupStats.percent)}
                {#if ($collectibleState.showCollected["customizations"] && groupStats.have > 0)
                    || ($collectibleState.showUncollected["customizations"] && groupStats.have < groupStats.total)}
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
                                {console.log(thing)}
                                {@const have =
                                    (thing.achievementId > 0 && !!$userAchievementStore.achievements[thing.achievementId]) ||
                                    (thing.questId > 0 && $userQuestStore.accountHas.has(thing.questId))}
                                {#if (have && $collectibleState.showCollected['customizations'])
                                    || (!have && $collectibleState.showUncollected['customizations'])}
                                    <tr
                                        class:faded={$collectibleState.highlightMissing['customizations'] ? have : !have}
                                    >
                                        <td class="yes-no">
                                            <YesNoIcon
                                                state={have}
                                                useStatusColors={true}
                                            />
                                        </td>
                                        <td class="name text-overflow">
                                            <ParsedText text={thing.name} />
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
                                {/if}
                            {/each}
                        </tbody>
                    </table>
                {/if}
            {/each}
        </div>
    </div>
{/if}
