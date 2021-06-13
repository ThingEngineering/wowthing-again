<script lang="ts">
    import type { TeamDataCharacter } from '@/types'

    export let teamCharacter: TeamDataCharacter
</script>

<style lang="scss">
    td {
        font-style: italic;
    }
</style>

<td colspan="2">{teamCharacter.note}</td>
