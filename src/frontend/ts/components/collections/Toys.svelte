<script lang="ts">
    import { data as staticData } from '@/stores/static-store'
    import { data as userData } from '@/stores/user-store'
    import type {Dictionary} from '@/types'

    import Collection from './Collection.svelte'

    export let params: { slug: string }

    const thingMap: Dictionary<number> = {}
    for (const toyId in $userData.toys) {
        thingMap[toyId] = parseInt(toyId)
    }
    console.log($userData.toys, thingMap)
</script>

<Collection route="toys" slug={params.slug} thingType="item" {thingMap} userHas={$userData.toys} sets={$staticData.ToySets} />
