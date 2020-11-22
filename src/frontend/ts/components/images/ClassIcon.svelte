<script lang="ts">
  import {data} from '../../stores/static-store'
  import Character from '../../models/character'

  import BaseImage from './BaseImage.svelte'

  export let character: Character
  export let size: number

  $: name = $data.Classes[character.classId].Icon
</script>

<BaseImage name={name} size={size} />
