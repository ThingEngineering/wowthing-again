<script lang="ts">
  import {data} from '../../stores/static-store'
  import {Character} from '../../types'

  import WowthingImage from './sources/WowthingImage.svelte'

  export let character: Character
  export let size: number
</script>

<WowthingImage name={$data.Classes[character.classId].Icon} {size} tooltip={$data.Classes[character.classId].Name} border=1 />
