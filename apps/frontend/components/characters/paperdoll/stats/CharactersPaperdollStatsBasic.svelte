<script lang="ts">
    import { StatType } from '@/enums/stat-type'
    import type { Character } from '@/types/character'

    export let character: Character
    export let type: StatType

    $: value = character.statistics.basic[type]?.effective || 0
</script>

{#if value > 0}
    <tr>
        <td>{StatType[type]}</td>
        <td>{value.toLocaleString()}</td>
    </tr>
{/if}
