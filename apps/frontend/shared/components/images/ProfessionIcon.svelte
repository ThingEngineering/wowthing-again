<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToSlug } from '@/data/professions'
    import { staticStore } from '@/shared/stores/static'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let id: number
    export let size = 20
    export let border = 0
</script>

<WowthingImage
    name={imageStrings[professionIdToSlug[id]]}
    tooltip={$staticStore.professions[id].name.split('|')[0]}
    {size}
    {border}
/>
