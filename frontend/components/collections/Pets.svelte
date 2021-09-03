<script lang="ts">
    import keys from 'lodash/keys'
    import { onMount } from 'svelte'

    import { staticStore } from '@/stores/static'
    import { userStore, userPetStore } from '@/stores'
    import type {Dictionary} from '@/types'
    import initializeSets from '@/utils/initialize-sets'

    import Collection from './Collection.svelte'

    export let params: { slug: string }

    onMount(async () => await userPetStore.fetch())

    let userHas: Dictionary<boolean>
    $: {
        if ($userPetStore.loaded) {
            userHas = {}
            for (const key of keys($userPetStore.data.pets)) {
                userHas[key] = true
            }

            initializeSets()
        }
    }
</script>

{#if $userPetStore.loaded}
    <Collection
        route="pets"
        slug={params.slug}
        thingType="npc"
        thingMap={$staticStore.data.creatureToPet}
        {userHas}
        sets={$staticStore.data.petSets}
    />
{/if}
