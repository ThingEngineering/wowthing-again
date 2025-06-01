<script lang="ts">
    import find from 'lodash/find';

    import { zoneData } from './data';
    import { worldQuestState } from './state';
    import { worldQuestStore } from './store';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { WorldQuestZone } from './types';

    import ContinentBox from './ContinentBox.svelte';
    import Image from '@/shared/components/images/Image.svelte';
    import WorldQuest from './WorldQuest.svelte';

    export let expansionSlug: string;
    export let mapSlug: string;

    let zone: WorldQuestZone;
    $: {
        const expansion = find(zoneData, (zone) => zone?.slug === expansionSlug);
        zone = mapSlug ? find(expansion.children, (zone) => zone?.slug === mapSlug) : expansion;
    }

    $: lessHeight = settingsState.value?.layout?.newNavigation ? '6.4rem' : '4.4rem';
</script>

<style lang="scss">
    .zone-map {
        --image-border-radius: 0;
        --image-border-width: 2px;

        position: relative;

        :global(> img) {
            max-height: calc(100vh - var(--less-height, 6.4rem));
            width: auto;
        }
    }
</style>

{#if zone}
    <div class="zone-map" style:--less-height={lessHeight}>
        <Image
            src="https://img.wowthing.org/maps/{zone.mapName}_1500_1000.webp"
            alt="Map of {zone.name}"
            border={2}
            width={1500}
            height={1000}
        />

        {#await worldQuestStore.fetch($worldQuestState.region)}
            L O A D I N G . . .
        {:then worldQuests}
            {#each (zone.children || []).filter((zone) => zone?.continentPoint) as childZone}
                <ContinentBox zone={childZone} worldQuests={worldQuests[childZone.id]} />
            {:else}
                {#each worldQuests[zone.id] || [] as worldQuest}
                    <WorldQuest {worldQuest} />
                {/each}
            {/each}
        {/await}
    </div>
{/if}
