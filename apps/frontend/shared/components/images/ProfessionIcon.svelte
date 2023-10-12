<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToString } from '@/data/professions'
    import { staticStore } from '@/shared/stores/static'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let id: number
    export let size = 20
    export let border = 0
</script>

<WowthingImage
    name={imageStrings[professionIdToString[id]]}
    tooltip={$staticStore.professions[id].name}
    {size}
    {border}
/>
