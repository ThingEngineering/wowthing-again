<script lang="ts">
  import {Character} from '../../types'

  import WowthingImage from './sources/WowthingImage.svelte'
  import {specializationMap} from '../../data/specialization'

  export let character: Character
  export let size: number

  $: spec = specializationMap[character.activeSpecId]
</script>

{#if spec !== undefined}
    <WowthingImage name={spec.Icon} {size} tooltip={spec.Name} border=1 />
{/if}
