<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'
    import maxBy from 'lodash/maxBy'
    import { getContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { petBreedMap } from '@/data/pet-breed'
    import { userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import type { UserDataPet } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import NpcLink from '@/components/links/NpcLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { thingMapFunc } = getContext('collection') as CollectionContext

    let element: HTMLElement
    let intersected = false
    let origId: number
    let pets: UserDataPet[]
    let quality: number
    let showAsMissing: boolean
    let userHasThing: number | undefined
    $: {
        userHasThing = find(things, (petId: number): boolean => $userStore.data.hasPet[petId] === true)
        origId = userHasThing ?? things[0]

        if (userHasThing) {
            pets = $userStore.data.pets[origId]
            quality = maxBy(pets, (pet: UserDataPet) => pet.quality).quality
            showAsMissing = $collectionState.highlightMissing['pets']
        }
        else {
            pets = []
            showAsMissing = !$collectionState.highlightMissing['pets']
        }
    }
</script>

<style lang="scss">
    .collection-item {
        width: 44px;
    }
    .pet {
        display: flex;
        font-family: monospace;
        font-size: 0.85rem;
        justify-content: space-between;
        line-height: 1.2;
        padding: 1px 1px 0 1px;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <div
        class="collection-object {userHasThing ? `quality${quality}` : 'has-not'}"
        bind:this={element}
        class:missing={showAsMissing}
        style:height="{44 + (18 * pets.length)}px"
    >
        {#if intersected}
            {@const creatureId = thingMapFunc(origId)}
            <NpcLink id={creatureId}>
                <WowthingImage
                    name="npc/{creatureId}"
                    size={40}
                    border={2}
                />
            </NpcLink>

            {#each pets as pet}
                <div class="pet quality{pet.quality}">
                    <span>{petBreedMap[pet.breedId]}</span>
                    <span>{pet.level}</span>
                </div>

                {#if userHasThing}
                    <div class="collected-icon drop-shadow">
                        <IconifyIcon icon={mdiCheckboxOutline} />
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</IntersectionObserver>
