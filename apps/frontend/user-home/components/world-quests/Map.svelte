<script lang="ts">
    import find from 'lodash/find'

    import { zoneData } from './data'
    import { worldQuestStore } from './store'
    import { settingsStore } from '@/stores/settings'

    import Image from '@/shared/components/images/Image.svelte'
    import WorldQuest from './WorldQuest.svelte'

    export let slug: string

    let mapFile: string
    let mapId: number
    let mapName: string
    $: {
        const mapInfo = find(zoneData, (zd) => zd !== null && zd[2] === slug)
        mapId = mapInfo?.[0]
        mapName = mapInfo?.[1]
        mapFile = mapInfo?.[3]
    }

    $: lessHeight = $settingsStore?.layout?.newNavigation ? '8rem' : '4.4rem'
</script>

<style lang="scss">
    .zone-map {
        --image-border-radius: 0;
        --image-border-width: 2px;

        position: relative;

        :global(> img) {
            max-height: calc(100vh - var(--less-height, 8rem));
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

{#if mapFile}
    <div
        class="zone-map"
        style:--less-height={lessHeight}
    >
        <Image
            src="https://img.wowthing.org/maps/{mapFile}_1500_1000.webp"
            alt="Map of {mapName}"
            border={2}
            width={1500}
            height={1000}
        />

        <div class="active-text abs-center border">
            Active World Quests
        </div>

        {#await worldQuestStore.fetch(mapId)}
            L O A D I N G . . .
        {:then worldQuests}
            {#each worldQuests as worldQuest}
                <WorldQuest {worldQuest} />
            {/each}
        {/await}
    </div>
{/if}
