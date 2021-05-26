<script lang="ts">
    import {specializationMap} from '@/data/character-specialization'
    import {data} from '@/stores/static-store'
    import type {Character} from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number

    let tooltip: string
    $: tooltip = character.activeSpecId > 0 ? `${specializationMap[character.activeSpecId].name} ${$data.Classes[character.classId].Name}` : $data.Classes[character.classId].Name
</script>

<WowthingImage name={$data.Classes[character.classId].Icon} {size} border={1} {tooltip} />
