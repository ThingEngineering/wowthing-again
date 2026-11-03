<script lang="ts">
    import { StatType } from '@/enums/stat-type';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & {
        type: StatType;
    };
    let { character, type }: Props = $props();

    let value = $derived(character.statistics.misc[type]?.value || 0);
</script>

{#if value > 0}
    <tr>
        <td>{StatType[type]}</td>
        <td>{value.toLocaleString()}</td>
    </tr>
{/if}
