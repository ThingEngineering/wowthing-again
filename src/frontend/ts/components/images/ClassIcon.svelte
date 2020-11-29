<script lang="ts">
  import {data} from '../../stores/static-store'
  import {Character} from '../../types'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number

  $: name = $data.Classes[character.classId].Icon
  $: tooltip = $data.Classes[character.classId].Name
</script>

<WowthingImage name={name} size={size} tooltip={tooltip} border=1 />
