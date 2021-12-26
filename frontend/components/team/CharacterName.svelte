<script lang="ts">
    import type { TeamDataCharacter } from '@/types'

    export let teamCharacter: TeamDataCharacter
</script>

<style lang="scss">
</style>

<td>{teamCharacter.character.name}</td>
<td>&ndash; {teamCharacter.character.realm.name}</td>
