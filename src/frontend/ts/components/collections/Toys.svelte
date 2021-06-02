<script lang="ts">
    import keyBy from 'lodash/keyBy'

    import { data as staticData } from '@/stores/static-store'
    import { data as userData } from '@/stores/user-store'

    import Collection from './Collection.svelte'

    export let params: { slug: string }

    const thingMap = {}
    for (const toyId in $userData.toys) {
        thingMap[toyId] = toyId
    }
    console.log($userData.toys, thingMap)
</script>

<Collection route="toys" slug={params.slug} thingType="item" {thingMap} userHas={$userData.toys} sets={$staticData.ToySets} />
