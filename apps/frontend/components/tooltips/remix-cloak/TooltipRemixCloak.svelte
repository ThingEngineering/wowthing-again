<script lang="ts">
    import { toNiceNumber } from '@/utils/formatting';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & { total: number };
    let { character, total }: Props = $props();

    const currencies: [string, number][] = [
        ['Primary', 2853],
        ['Stamina', 2854],
        ['Crit', 2855],
        ['Haste', 2856],
        ['Mastery', 2858],
        ['Versatility', 2860],
        ['Leech', 2857],
        ['Speed', 2859],
        ['% XP', 3001],
    ];
</script>

<style lang="scss">
    .text {
        --width: 5rem;

        text-align: left;
    }
    .value {
        text-align: right;
        word-spacing: -0.2ch;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Remix Cloak</h5>

    <table class="table-striped">
        <tbody>
            {#each currencies as [text, currencyId] (currencyId)}
                {@const have = character.currencies?.[currencyId]?.quantity || 0}
                {#if have > 0}
                    <tr>
                        <td class="value">+{toNiceNumber(have)}</td>
                        <td class="text">{text}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>

    <div class="bottom">
        <div>
            {total.toLocaleString()} threads
        </div>
    </div>
</div>
