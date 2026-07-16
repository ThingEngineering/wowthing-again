<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { ManualDataHeirloomGroup } from '@/types/data/manual';

    import Options from './Options.svelte';
    import Section from './Section.svelte';

    let sections = $derived.by(() => {
        const ret: [string, ManualDataHeirloomGroup[]][] = [
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
            ret.push([
                'Unavailable',
                wowthingData.manual.heirlooms.filter((group) =>
                    group.name.startsWith('Unavailable')
                ),
            ]);
        }

        return ret;
    });

    let containerElement = $state<HTMLElement>(null);
    let resizeableElement = $state<HTMLElement>(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'collection-v2-group', {
                columnCount: '--column-count',
                gap: 30,
                padding: '1.5rem',
            });
        } else {
            return null;
        }
    });

    $effect(() => debouncedResize?.());
</script>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <Options />

    <div class="collection thing-container" bind:this={resizeableElement}>
        {#each sections as [sectionName, groups] (sectionName)}
            <Section name={sectionName} {groups} />
        {/each}
    </div>
</div>
