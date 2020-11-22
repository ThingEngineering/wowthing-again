<script lang="ts">
  import {data} from '../../stores/static-store'
  import Character from '../../models/character'

  import BaseImage from './BaseImage.svelte'

  export let character: Character
  export let size: number

  $: name = $data.Races[character.raceId][character.gender === 1 ? 'IconMale' : 'IconFemale']
</script>

<BaseImage name={name} size={size} />
