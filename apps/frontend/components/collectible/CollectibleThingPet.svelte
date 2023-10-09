<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'
    import maxBy from 'lodash/maxBy'
    import { getContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { petBreedMap } from '@/data/pet-breed'
    import { userStore } from '@/stores'
    import { collectibleState } from '@/stores/local-storage'
    import type { UserDataPet } from '@/types'
    import type { CollectibleContext } from '@/types/contexts'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import NpcLink from '@/shared/links/NpcLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { thingMapFunc } = getContext('collection') as CollectibleContext

    let element: HTMLElement
    let intersected = false
    let origId: number
    let pets: UserDataPet[]
    let quality: number
    let showAsMissing: boolean
    let userHasThing: number | undefined
    $: {
        userHasThing = find(things, (petId: number): boolean => $userStore.hasPet[petId] === true)
        origId = userHasThing ?? things[0]

        if (userHasThing) {
            pets = $userStore.pets[origId]
            quality = maxBy(pets, (pet: UserDataPet) => pet.quality).quality
            showAsMissing = $collectibleState.highlightMissing['pets']
        }
        else {
            pets = []
            showAsMissing = !$collectibleState.highlightMissing['pets']
        }
    }
</script>

<style lang="scss">
    .collection-object {
        height: 44px;
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
        bind:this={element}
        class="collection-object {userHasThing ? `quality${quality}` : 'has-not'}"
        class:missing={showAsMissing}
        style:height={pets.length > 0 ? `${44 + (18 * pets.length)}px` : null}
        data-id={origId}
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
