<script lang="ts">
  import {data} from '../../stores/static-store'
  import {Character} from '../../types'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number

  $: gender = character.gender === 1 ? 'Male' : 'Female'
  $: iconName = $data.Races[character.raceId]['Icon' + gender]
  $: tooltip = `${ gender } ${ $data.Races[character.raceId].Name }`
</script>

<WowthingImage name={iconName} size={size} tooltip={tooltip} border=1 />
