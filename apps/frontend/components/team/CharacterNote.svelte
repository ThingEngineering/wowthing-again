<script lang="ts">
    import type { TeamDataCharacter } from '@/types';

    let { teamCharacter }: { teamCharacter: TeamDataCharacter } = $props();
</script>

<style lang="scss">
    td {
        font-style: italic;
    }
</style>

<td colspan="2">{teamCharacter.note}</td>
