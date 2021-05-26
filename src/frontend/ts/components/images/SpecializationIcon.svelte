<script lang="ts">
    import {specializationMap} from '@/data/character-specialization'
    import type {Character, CharacterSpecialization} from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number
    export let border: number = 1

    let spec: CharacterSpecialization
    $: spec = specializationMap[character.activeSpecId]
</script>

{#if spec !== undefined}
    <WowthingImage name={spec.icon} {size} tooltip={spec.name} {border} />
{/if}
