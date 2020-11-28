<script lang="ts">
  import Character from '../../models/character'
  import {data} from '../../stores/static-store'
  import tippy from '../../utils/tippy'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number

  $: name = $data.Classes[character.classId].Icon
  $: tooltip = $data.Classes[character.classId].Name
</script>

<WowthingImage name={name} size={size} tooltip={tooltip} />
