<script lang="ts">
    import type { TeamDataCharacter } from '@/types';

    let { teamCharacter }: { teamCharacter: TeamDataCharacter } = $props();
</script>

<style lang="scss">
</style>

<td>{teamCharacter.character.name}</td>
<td>&ndash; {teamCharacter.character.realm.name}</td>
