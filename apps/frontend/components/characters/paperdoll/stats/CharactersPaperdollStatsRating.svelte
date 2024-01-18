<script lang="ts">
    import { StatType } from '@/enums/stat-type'
    import type { Character } from '@/types/character'

    export let character: Character
    export let label = ''
    export let type: StatType

    let bonus: number
    let value: number
    $: {
        if (type === StatType.VersatilityDamageTaken) {
            bonus = character.statistics.misc[StatType.VersatilityRating]?.value || 0
            value = character.statistics.misc[type]?.value || 0
        }
        else if (type === StatType.VersatilityDamageDone) {
            bonus = character.statistics.misc[StatType.VersatilityRating]?.value || 0
            value = character.statistics.misc[type]?.value || 0
        }
        else if (type === StatType.AvoidanceRating) {
            bonus = character.statistics.rating[StatType.AvoidanceRating]?.rating || 0
            value = character.statistics.rating[StatType.AvoidanceRating]?.ratingBonus || 0
        }
        else {
            bonus = character.statistics.rating[type]?.rating || 0
            value = character.statistics.rating[type]?.value || 0
        }
    }
</script>

{#if value > 0}
    <tr>
        <td>
            {label || StatType[type]}
        </td>
        <td>
            + {bonus.toLocaleString()}
            <br>
            <code>{(value / 100).toLocaleString()} %</code>
        </td>
    </tr>
{/if}
