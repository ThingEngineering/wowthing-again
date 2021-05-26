<script lang="ts">
    import {specializationMap} from '@/data/specialization'
    import {data} from '@/stores/static-store'
    import type {Character} from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number

    $: tooltip = character.activeSpecId > 0 ? `${specializationMap[character.activeSpecId].Name} ${$data.Classes[character.classId].Name}` : $data.Classes[character.classId].Name;
</script>

<WowthingImage name={$data.Classes[character.classId].Icon} {size} border={1} {tooltip} />
