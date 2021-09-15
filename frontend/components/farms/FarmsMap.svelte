<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import {location, querystring, replace} from 'svelte-spa-router'

    import {
        farmStore,
        staticStore,
        timeStore,
        userCollectionStore,
        userQuestStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import getFarmStatus from '@/utils/get-farm-status'
    import type {FarmDataCategory} from '@/types/data'
    import type {FarmStatus} from '@/utils/get-farm-status'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Farm from './FarmsFarm.svelte'
    import Map from '@/components/images/Map.svelte'

    export let slug1: string
    export let slug2: string

    // TODO calculate this based on width
    const width = 1200
    const height = 800

    let categories: FarmDataCategory[]
    let farmStatuses: FarmStatus[]
    let trackMounts: boolean
    let trackPets: boolean
    let trackToys: boolean
    let trackTransmog: boolean

    $: {
        // Parse query string
        const parsed = new URLSearchParams($querystring)
        trackMounts = parsed.get('trackMounts') !== 'false'
        trackPets = parsed.get('trackPets') !== 'false'
        trackToys = parsed.get('trackToys') !== 'false'
        trackTransmog = parsed.get('trackTransmog') !== 'false'
    }

    $: {
        // Update query string
        const queryParts = []
        if (!trackMounts) {
            queryParts.push('trackMounts=false')
        }
        if (!trackPets) {
            queryParts.push('trackPets=false')
        }
        if (!trackToys) {
            queryParts.push('trackToys=false')
        }
        if (!trackTransmog) {
            queryParts.push('trackTransmog=false')
        }

        const qs = queryParts.join('&')
        if (qs !== $querystring) {
            replace($location + (qs ? '?' + qs : ''))
        }
    }

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
                {
                    trackMounts,
                    trackPets,
                    trackToys,
                    trackTransmog,
                }
            )
        }
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
</style>

{#if categories.length > 0}
    <div class="farm">
        <div class="toggles">
            <button>
                <CheckboxInput
                    name="track_mounts"
                    label="Track mounts"
                    bind:value={trackMounts}
                />
            </button>

            <button>
                <CheckboxInput
                    name="track_pets"
                    label="Track pets"
                    bind:value={trackPets}
                />
            </button>

            <button>
                <CheckboxInput
                    name="track_toys"
                    label="Track toys"
                    bind:value={trackToys}
                />
            </button>

            <button>
                <CheckboxInput
                    name="track_transmog"
                    label="Track transmog"
                    bind:value={trackTransmog}
                />
            </button>
        </div>

        <Map
            name={categories[0].slug}
            width={width}
            height={height}
            alt="Map of {categories[0].name}"
            border={2}
        />

        {#each categories[0].farms as farm, farmIndex}
            <Farm
                {farm}
                status={farmStatuses[farmIndex]}
            />
        {/each}
    </div>
{/if}
