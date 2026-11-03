<script lang="ts">
    import { StatType } from '@/enums/stat-type';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & {
        type: StatType;
        label?: string;
    };

    let { character, type, label }: Props = $props();

    let [bonus, value] = $derived.by(() => {
        if (type === StatType.VersatilityDamageTaken) {
            return [
                character.statistics.misc[StatType.VersatilityRating]?.value || 0,
                character.statistics.misc[type]?.value || 0,
            ];
        } else if (type === StatType.VersatilityDamageDone) {
            return [
                character.statistics.misc[StatType.VersatilityRating]?.value || 0,
                character.statistics.misc[type]?.value || 0,
            ];
        } else if (type === StatType.AvoidanceRating || type === StatType.SpeedRating) {
            return [
                character.statistics.rating[type]?.rating || 0,
                character.statistics.rating[type]?.ratingBonus || 0,
            ];
        } else {
            return [
                character.statistics.rating[type]?.rating || 0,
                character.statistics.rating[type]?.value || 0,
            ];
        }
    });
</script>

{#if bonus > 0 || value > 0}
    <tr>
        <td>
            {label || StatType[type]}
        </td>
        <td>
            + {bonus.toLocaleString()}
            <br />
            <code>{(value / 100).toLocaleString()} %</code>
        </td>
    </tr>
{/if}
