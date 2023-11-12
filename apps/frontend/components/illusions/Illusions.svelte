<script lang="ts">
    import find from 'lodash/find'

    import { manualStore, lazyStore, userTransmogStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { illusionState } from '@/stores/local-storage'
    import { settingsStore } from '@/shared/stores/settings'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import getPercentClass from '@/utils/get-percent-class'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { ManualDataIllusionGroup } from '@/types/data/manual'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import Count from '@/components/collectible/CollectibleCount.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    let sections: [string, ManualDataIllusionGroup[]][]
    $: {
        sections = [
            ['Available', $manualStore.illusions.filter((group) => !group.name.startsWith('Unavailable'))],
        ]

        if (!$settingsStore.collections.hideUnavailable || $lazyStore.illusions['UNAVAILABLE'].have > 0) {
            sections.push([
                'Unavailable',
                $manualStore.illusions.filter((group) => group.name.startsWith('Unavailable'))
            ])
        }
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'collection-v2-group',
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
</script>

<style lang="scss">
    .collection-v2-group {
        width: 17.5rem;
    }
    .collection-object {
        min-height: 44px;
        width: 44px;
    }
    .pill {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: -1px;
    }
    .player-class {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        left: -1px;
        width: 24px;
        position: absolute;
        top: -1px;
    }

</style>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <div class="options-container">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={$illusionState.highlightMissing}
            >Highlight missing</CheckboxInput>
        </button>
    
        <!-- <span>Show:</span>
    
        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={$illusionState.showCollected}
            >Collected</CheckboxInput>
        </button>
    
        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={$illusionState.showUncollected}
            >Missing</CheckboxInput>
        </button> -->
    </div>

    <div class="collection thing-container" bind:this={resizeableElement}>
        {#each sections as [sectionName, groups]}
            <SectionTitle
                count={$lazyStore.illusions[sectionName.toUpperCase()]}
                title={sectionName}
            />
            <div class="collection-v2-section">
                {#each groups as group}
                    {@const groupCount = $lazyStore.illusions[group.name]}
                    <div class="collection-v2-group">
                        <h4 class="drop-shadow text-overflow {getPercentClass(groupCount.percent)}">
                            {group.name.replace('Unavailable - ', '')}
                            <Count counts={groupCount} />
                        </h4>
                        <div class="collection-objects">
                            {#each group.items as item}
                                {@const illusion = find($staticStore.illusions, (illusion) => illusion.enchantmentId === item.enchantmentId)}
                                {@const have = $userTransmogStore.hasIllusion.has(illusion.enchantmentId)}
                                <div
                                    class="collection-object"
                                    class:missing={
                                        ($illusionState.highlightMissing && have) ||
                                        (!$illusionState.highlightMissing && !have)
                                    }
                                    use:basicTooltip={illusion.name}
                                >
                                    <WowthingImage
                                        name="enchantment/{item.enchantmentId}"
                                        size={40}
                                        border={2}
                                    />

                                    {#if have}
                                        <CollectedIcon />
                                    {/if}

                                    {#each (item.classes || []) as classId}
                                        <div class="player-class class-{classId} drop-shadow">
                                            <ClassIcon
                                                border={2}
                                                size={20}
                                                {classId}
                                            />
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
