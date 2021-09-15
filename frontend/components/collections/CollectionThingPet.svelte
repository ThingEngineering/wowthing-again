<script lang="ts">
    import find from 'lodash/find'
    import maxBy from 'lodash/maxBy'
    import { getContext } from 'svelte'

    import {petBreedMap} from '@/data/pet-breed'
    import {userCollectionStore} from '@/stores'
    import type {CollectionContext} from '@/types/contexts'
    import type {UserCollectionDataPet} from '@/types/data'

    import NpcLink from '@/components/links/NpcLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    const { thingMap } = getContext('collection') as CollectionContext

    let origId: number
    let pets: UserCollectionDataPet[]
    let quality: number
    let userHasThing: number | undefined
    $: {
        userHasThing = find(things, (value: number): boolean => $userCollectionStore.data.pets[thingMap[value] || -1] !== undefined)
        origId = userHasThing ?? things[0]

        if (userHasThing) {
            pets = $userCollectionStore.data.pets[thingMap[origId]]
            quality = maxBy(pets, (pet: UserCollectionDataPet) => pet.quality).quality
        }
    }
</script>

<style lang="scss">
    .thing {
        --image-border-width: 2px;

        border-radius: $border-radius;
        display: inline-block;
        width: 44px;

        &.thing-no {
            opacity: 0.4;
        }
    }
    .thing:not(:first-of-type) {
        margin-left: 3px;
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

<div class="thing {userHasThing ? `quality${quality}` : 'thing-no quality0'}">
    <NpcLink id={origId}>
        <WowthingImage name="npc/{origId}" size={40} border={2} />
    </NpcLink>

    {#if pets}
        {#each pets as pet}
            <div class="pet quality{pet.quality}">
                <span>{petBreedMap[pet.breedId]}</span>
                <span>{pet.level}</span>
            </div>
        {/each}
    {/if}
</div>
