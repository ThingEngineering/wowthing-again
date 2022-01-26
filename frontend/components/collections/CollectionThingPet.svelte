<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import find from 'lodash/find'
    import maxBy from 'lodash/maxBy'

    import { petBreedMap } from '@/data/pet-breed'
    import { staticStore, userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import type { UserDataPet } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import NpcLink from '@/components/links/NpcLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let things: number[] = []

    let origId: number
    let pets: UserDataPet[]
    let quality: number
    let showAsMissing: boolean
    let userHasThing: number | undefined
    $: {
        userHasThing = find(things, (value: number): boolean => $userStore.data.hasPetCreature[value] === true)
        origId = userHasThing ?? things[0]

        if (userHasThing) {
            pets = $userStore.data.pets[$staticStore.data.petsByCreatureId[origId].id]
            quality = maxBy(pets, (pet: UserDataPet) => pet.quality).quality
            showAsMissing = $collectionState.highlightMissing['pets']
        }
        else {
            showAsMissing = !$collectionState.highlightMissing['pets']
        }
    }
</script>

<style lang="scss">
    .pet {
        display: flex;
        font-family: monospace;
        font-size: 0.85rem;
        justify-content: space-between;
        line-height: 1.2;
        padding: 1px 1px 0 1px;
    }
</style>

<div
    class="{userHasThing ? `quality${quality}` : 'has-not'}"
    class:missing={showAsMissing}
>
    <NpcLink id={origId}>
        <WowthingImage
            name="npc/{origId}"
            size={40}
            border={2}
        />
    </NpcLink>

    {#if pets}
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
