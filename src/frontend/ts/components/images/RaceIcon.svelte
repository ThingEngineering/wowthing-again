<script lang="ts">
  import {data} from '@/stores/static-store'
  import type {Character} from '@/types'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number

  let gender: string
  let iconName: string
  let tooltip: string

  $: {
      const race = $data.Races[character.raceId]

      if (character.gender === 1) {
          gender = 'Male'
          iconName = race.IconMale
      }
      else {
          gender = 'Female'
          iconName = race.IconFemale
      }

      tooltip = `${ gender } ${ race.Name }`
  }
</script>

<WowthingImage name={iconName} {size} border={1} {tooltip} />
