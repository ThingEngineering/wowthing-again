<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import {
        farmStore,
        staticStore,
        timeStore,
        userCollectionStore,
        userQuestStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import {farmState} from '@/stores/local-storage/farm'
    import {farmMapMedia} from '@/stores/media-queries/farm-map'
    import getFarmStatus from '@/utils/get-farm-status'
    import type {FarmDataCategory} from '@/types/data'
    import type {FarmStatus} from '@/utils/get-farm-status'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Farm from './FarmsFarm.svelte'
    import Image from '@/components/images/Image.svelte'

    export let slug1: string
    export let slug2: string

    let categories: FarmDataCategory[]
    let farmStatuses: FarmStatus[]
    let height: number
    let width: number

    $: {
        categories = filter(
            find($farmStore.data.sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.farms.length > 0
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }

        if (categories.length > 0) {
            farmStatuses = getFarmStatus(
                $staticStore.data,
                $userStore.data,
                $userCollectionStore.data,
                $userQuestStore.data,
                $userTransmogStore.data,
                $timeStore,
                categories[0],
                $farmState,
            )
        }
    }

    $: {
        [width, height] = $farmMapMedia
    }
</script>

<style lang="scss">
    .farm {
        --image-border-radius: #{$border-radius-large};
        --image-border-width: 2px;

        position: relative;
    }
    .toggles {
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        top: 1px;
        width: 100%;
        z-index: 1;
    }
    button {
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
    }
    .credits {
        bottom: 1px;
        display: flex;
        position: absolute;
        right: 1px;
        z-index: 1;

        div {
            background: $highlight-background;
            border: 1px solid $border-color;
            border-radius: $border-radius;
            padding: 0.1rem 0.4rem 0.2rem;
        }
    }
</style>

{#if categories.length > 0}
    <div class="farm">
        <div class="toggles">
            <button>
                <CheckboxInput
                    name="track_mounts"
                    bind:value={$farmState.trackMounts}
                >Track mounts</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="track_pets"
                    bind:value={$farmState.trackPets}
                >Track pets</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                        name="track_quests"
                        bind:value={$farmState.trackQuests}
                >Track quests</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="track_toys"
                    bind:value={$farmState.trackToys}
                >Track toys</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="track_transmog"
                    bind:value={$farmState.trackTransmog}
                >Track transmog</CheckboxInput>
            </button>
        </div>

        <Image
            src="https://img.wowthing.org/maps/{categories[0].mapName}_{width}_{height}.webp"
            alt="Map of {categories[0].name}"
            border={2}
            {width}
            {height}
        />

        {#each categories[0].farms as farm, farmIndex}
            <Farm
                {farm}
                status={farmStatuses[farmIndex]}
            />
        {/each}

        <div class="credits">
            {#if categories[0].wowheadGuide}
                <div>
                    <a href="{categories[0].wowheadGuide}">Wowhead guide</a>
                </div>
            {/if}

            <div>
                Data sources:
                <a href="https://github.com/zarillion/handynotes-plugins">HandyNotes Plugins</a> /
                <a href="https://www.wowdb.com">WoWDB</a> /
                <a href="https://www.wowhead.com">Wowhead</a> /
                <a href="https://wow.tools">WoW.tools</a>
            </div>
        </div>
    </div>
{/if}
