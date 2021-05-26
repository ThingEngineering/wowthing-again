<script lang="ts">
    import {specializationMap} from '@/data/specialization'
    import type {Character} from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number
    export let border: number = 1

    $: spec = specializationMap[character.activeSpecId]
</script>

{#if spec !== undefined}
    <WowthingImage name={spec.Icon} {size} tooltip={spec.Name} {border} />
{/if}
