<script lang="ts">
  import {data} from '../../stores/static-store'
  import {Character} from '../../types'

  import WowthingImage from './sources/WowthingImage.svelte'
  import {specializationMap} from '../../data/specialization'

  export let character: Character
  export let size: number

  $: tooltip = character.activeSpecId > 0 ? `${specializationMap[character.activeSpecId].Name} ${$data.Classes[character.classId].Name}` : $data.Classes[character.classId].Name;
</script>

<WowthingImage name={$data.Classes[character.classId].Icon} {size} tooltip={tooltip} border=1 />
