<script lang="ts">
  import {data} from '../../stores/static-store'
  import Character from '../../models/character'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number

  $: name = $data.Classes[character.classId].Icon
</script>

<WowthingImage name={name} size={size} />
