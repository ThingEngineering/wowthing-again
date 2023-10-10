<script lang="ts">
    import type { Covenant } from '@/types'
    import { covenantMap, covenantNameMap } from '@/data/covenant'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let covenant: Covenant = undefined
    export let covenantId = 0
    export let covenantName = ''
    export let size = 20
    export let border = 0

    $: {
        covenant = covenant || covenantMap[covenantId] || covenantNameMap[covenantName]
    }
</script>

<WowthingImage
    name={covenant.icon}
    tooltip={covenant.name}
    {size}
    {border}
/>
