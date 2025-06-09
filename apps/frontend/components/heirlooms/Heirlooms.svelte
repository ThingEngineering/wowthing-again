<script lang="ts">
    import { afterUpdate } from 'svelte';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { ManualDataHeirloomGroup } from '@/types/data/manual';

    import Group from './HeirloomsGroup.svelte';
    import Options from './HeirloomsOptions.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    let sections: [string, ManualDataHeirloomGroup[]][];
    $: {
        sections = [
            [
                'Available',
                wowthingData.manual.heirlooms.filter(
                    (group) => !group.name.startsWith('Unavailable')
                ),
            ],
        ];

        if (
            !settingsState.value.collections.hideUnavailable ||
            userState.heirloomStats.UNAVAILABLE.have > 0
        ) {
            sections.push([
                'Unavailable',
                wowthingData.manual.heirlooms.filter((group) =>
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

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <Options />

    <div class="collection thing-container" bind:this={resizeableElement}>
        {#each sections as [sectionName, groups]}
            <SectionTitle
                count={userState.heirloomStats[sectionName.toUpperCase()]}
                title={sectionName}
            />
            <div class="collection-v2-section">
                {#each groups as group}
                    <Group {group} />
                {/each}
            </div>
        {/each}
    </div>
</div>
