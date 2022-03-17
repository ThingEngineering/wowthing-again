<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import { zoneMapStore } from '@/stores'
    import { zoneMapState } from '@/stores/local-storage/zone-map'
    import { zoneMapMedia } from '@/stores/media-queries/zone-map'
    import type { FarmStatus } from '@/types'
    import type { ZoneMapDataCategory } from '@/types/data'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Image from '@/components/images/Image.svelte'
    import Thing from './ZoneMapsThing.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ZoneMapDataCategory[]
    let farmStatuses: FarmStatus[]
    let height: number
    let width: number

    $: {
        categories = filter(
            find($zoneMapStore.data.sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s?.farms?.length > 0
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        if (categories.length > 0) {
            farmStatuses = $zoneMapStore.data.farmStatus[slug2 ? `${slug1}--${slug2}` : slug1]
        }
    }

    $: {
        [width, height] = $zoneMapMedia
    }
</script>

<style lang="scss">
    .farm {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        position: relative;
    }
    .toggles {
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        display: flex;
        justify-content: center;
        left: 50%;
        padding: 0.2rem 0.3rem;
        position: absolute;
        top: 1px;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 1;

        & :global(fieldset:not(:first-child)) {
            margin-left: 0.3rem;
        }
    }
    .toggle-group {
        display: flex;

        &:not(:first-child) {
            border-left: 1px solid $border-color;
            margin-left: 0.5rem;
            padding-left: 0.5rem;
        }
    }
    .credits {
        bottom: 1px;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        padding: 0 1px;
        position: absolute;
        width: 100%;
        z-index: 1;

        div {
            background: $highlight-background;
            border: 1px solid $border-color;
            border-radius: $border-radius;
            padding: 0.1rem 0.4rem 0.2rem;
        }
    }
</style>

{#if categories.length > 0 && farmStatuses}
    <div class="farm">
        <div class="toggles">
            <div class="toggle-group">
                <CheckboxInput
                    name="show_completed"
                    bind:value={$zoneMapState.showCompleted}
                >Completed</CheckboxInput>
                <CheckboxInput
                    name="show_killed"
                    bind:value={$zoneMapState.showKilled}
                >Killed</CheckboxInput>
            </div>

            <div class="toggle-group">
                <CheckboxInput
                    name="track_mounts"
                    bind:value={$zoneMapState.trackMounts}
                >Mounts</CheckboxInput>

                <CheckboxInput
                    name="track_pets"
                    bind:value={$zoneMapState.trackPets}
                >Pets</CheckboxInput>

                <CheckboxInput
                        name="track_quests"
                        bind:value={$zoneMapState.trackQuests}
                >Quests</CheckboxInput>

                <CheckboxInput
                    name="track_toys"
                    bind:value={$zoneMapState.trackToys}
                >Toys</CheckboxInput>

                <CheckboxInput
                    name="track_transmog"
                    bind:value={$zoneMapState.trackTransmog}
                >Transmog</CheckboxInput>
            </div>
        </div>

        <Image
            src="https://img.wowthing.org/maps/{categories[0].mapName}_{width}_{height}.webp"
            alt="Map of {categories[0].name}"
            border={2}
            {width}
            {height}
        />

        {#each categories[0].farms as farm, farmIndex}
            <Thing
                {farm}
                status={farmStatuses[farmIndex]}
            />
        {/each}

        <div class="credits">
            <div>
                Data sources:
                <a href="https://github.com/zarillion/handynotes-plugins">HandyNotes Plugins</a> /
                <a href="https://www.wowdb.com">WoWDB</a> /
                <a href="https://www.wowhead.com">Wowhead</a> /
                <a href="https://wow.tools">WoW.tools</a>
            </div>

            {#if categories[0].wowheadGuide}
                <div>
                    <a href="{categories[0].wowheadGuide}">Wowhead guide</a>
                </div>
            {/if}
        </div>
    </div>
{/if}
