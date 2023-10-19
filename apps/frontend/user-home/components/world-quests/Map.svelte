<script lang="ts">
    import find from 'lodash/find'

    import { zoneData } from './data'
    import { worldQuestState } from './state'
    import { worldQuestStore } from './store'
    import { settingsStore } from '@/stores/settings'
    import type { WorldQuestExpansion, WorldQuestZone } from './types'

    import Image from '@/shared/components/images/Image.svelte'
    import WorldQuest from './WorldQuest.svelte'

    export let expansionSlug: string
    export let mapSlug: string

    let zone: WorldQuestZone
    $: {
        const expansion = find(zoneData, (zone) => zone?.slug === expansionSlug)
        zone = mapSlug ? find(expansion.children, (zone) => zone?.slug === mapSlug) : expansion
    }

    $: lessHeight = $settingsStore?.layout?.newNavigation ? '6.4rem' : '4.4rem'
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
    .active-text {
        background: $highlight-background;
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
        border-width: 2px;
        font-size: 110%;
        padding: 0.1rem 0.5rem;
        position: absolute;
        top: 0;
    }
</style>

{#if zone}
    <div
        class="zone-map"
        style:--less-height={lessHeight}
    >
        <Image
            src="https://img.wowthing.org/maps/{zone.mapName}_1500_1000.webp"
            alt="Map of {zone.name}"
            border={2}
            width={1500}
            height={1000}
        />

        {#await worldQuestStore.fetch($worldQuestState.region, zone.id)}
            L O A D I N G . . .
        {:then worldQuests}
            {#each worldQuests as worldQuest}
                <WorldQuest {worldQuest} />
            {/each}
        {/await}
    </div>
{/if}
