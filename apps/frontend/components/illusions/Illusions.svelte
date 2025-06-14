<script lang="ts">
    import { afterUpdate } from 'svelte';

    import { illusionState } from '@/stores/local-storage';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import getPercentClass from '@/utils/get-percent-class';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import type { ManualDataIllusionGroup } from '@/types/data/manual';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import Count from '@/components/collectible/CollectibleCount.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    let sections: [string, ManualDataIllusionGroup[]][];
    $: {
        sections = [
            [
                'Available',
                wowthingData.manual.illusions.filter(
                    (group) => !group.name.startsWith('Unavailable')
                ),
            ],
        ];

        if (
            !settingsState.value.collections.hideUnavailable ||
            userState.illusionStats['UNAVAILABLE'].have > 0
        ) {
            sections.push([
                'Unavailable',
                wowthingData.manual.illusions.filter((group) =>
                    group.name.startsWith('Unavailable')
                ),
            ]);
        }
    }

    let containerElement: HTMLElement;
    let resizeableElement: HTMLElement;
    let debouncedResize: () => void;
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'collection-v2-group',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '1.5rem',
                }
            );
            debouncedResize();
        } else {
            debouncedResize = null;
        }
    }

    afterUpdate(() => debouncedResize?.());
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
            <CheckboxInput name="highlight_missing" bind:value={$illusionState.highlightMissing}
                >Highlight missing</CheckboxInput
            >
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
                count={userState.illusionStats[sectionName.toUpperCase()]}
                title={sectionName}
            />
            <div class="collection-v2-section">
                {#each groups as group}
                    {@const groupCount = userState.illusionStats[group.name]}
                    <div class="collection-v2-group">
                        <h4 class="drop-shadow text-overflow {getPercentClass(groupCount.percent)}">
                            {group.name.replace('Unavailable - ', '')}
                            <Count counts={groupCount} />
                        </h4>
                        <div class="collection-objects">
                            {#each group.items as item}
                                {@const illusion = wowthingData.static.illusionByEnchantmentId.get(
                                    item.enchantmentId
                                )}
                                {@const have = userState.general.hasIllusionByEnchantmentId.has(
                                    illusion.enchantmentId
                                )}
                                <div
                                    class="collection-object"
                                    class:missing={($illusionState.highlightMissing && have) ||
                                        (!$illusionState.highlightMissing && !have)}
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

                                    {#each item.classes || [] as classId}
                                        <div class="player-class class-{classId} drop-shadow">
                                            <ClassIcon border={2} size={20} {classId} />
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
