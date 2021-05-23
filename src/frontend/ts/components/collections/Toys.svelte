<script lang="ts">
    import { data as staticData } from '../../stores/static-store'
    import { data as userData } from '../../stores/user-store'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection route="toys" slug={params.slug} thingType="item" thingMap={{}} userHas={$userData.toys} sets={$staticData.ToySets} />
