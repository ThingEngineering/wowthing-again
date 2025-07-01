<script lang="ts">
    import { afterUpdate } from 'svelte';

    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataIllusionGroup } from '@/types/data/manual';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import Count from '@/components/collectible/CollectibleCount.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import Illusion from './Illusion.svelte';

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
</style>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <div class="options-container">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={browserState.current.illusions.highlightMissing}
                >Highlight missing</CheckboxInput
            >
        </button>

        <!-- <span>Show:</span>
    
        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={browserState.current.illusions.showCollected}
            >Collected</CheckboxInput>
        </button>
    
        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={browserState.current.illusions.showUncollected}
            >Missing</CheckboxInput>
        </button> -->
    </div>

    <div class="collection thing-container" bind:this={resizeableElement}>
        {#each sections as [sectionName, groups] (sectionName)}
            <SectionTitle
                count={userState.illusionStats[sectionName.toUpperCase()]}
                title={sectionName}
            />
            <div class="collection-v2-section">
                {#each groups as group (group)}
                    {@const groupCount = userState.illusionStats[group.name]}
                    <div class="collection-v2-group">
                        <h4 class="drop-shadow text-overflow {getPercentClass(groupCount.percent)}">
                            {group.name.replace('Unavailable - ', '')}
                            <Count counts={groupCount} />
                        </h4>
                        <div class="collection-objects">
                            {#each group.items as item (item.enchantmentId)}
                                <Illusion {item} />
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
