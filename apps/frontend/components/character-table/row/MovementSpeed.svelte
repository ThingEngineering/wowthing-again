<script lang="ts">
    import { StatType } from '@/enums/stat-type';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let speed = $derived(character.statistics?.rating?.[StatType.SpeedRating]?.ratingBonus || 0);
</script>

<style lang="scss">
    td {
        --width: 2rem;

        word-spacing: -0.2ch;
    }
</style>

<td class="r b-l sized">
    {#if speed > 0}
        +{(speed / 100).toFixed(1)}%
    {/if}
</td>
