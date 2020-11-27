<script lang="ts">
  import {data} from '../../stores/static-store'
  import Character from '../../models/character'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number

  $: name = $data.Races[character.raceId][character.gender === 1 ? 'IconMale' : 'IconFemale']
</script>

<WowthingImage name={name} size={size} />
