<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { Faction } from '@/types/enums'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let faction: Faction
    export let size = 20
    export let border = 1

    let tooltip: string
    $: {
        tooltip = Faction[faction]
    }
</script>

<WowthingImage
    name={faction === Faction.Alliance ? imageStrings.alliance : imageStrings.horde}
    cls="faction{faction}"
    {border}
    {size}
    {tooltip}
/>
