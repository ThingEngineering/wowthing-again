<script lang="ts">
    import { Constants } from '@/data/constants'
    import { pvpVaultItemLevel } from '@/data/pvp'
    import type { Character, CharacterWeeklyProgress } from '@/types'
    import { toNiceNumber } from "../../../utils/to-nice";

    export let character: Character

    let pvpVault: CharacterWeeklyProgress[]
    $: {
        if (character.level === Constants.characterMaxLevel) {
            pvpVault = character.weekly?.vault?.rankedPvpProgress
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault);

        border-left: 1px solid $border-color;
    }
    span {
        display: inline-block;
        text-align: center;
        width: calc(#{$width-vault} / 3 - 0.2rem);
        word-spacing: -0.2ch;
    }
</style>

{#if pvpVault}
    <td>
        <div class="flex-wrapper">
            {#each pvpVault as progress}
                {#if progress.progress >= progress.threshold}
                    <span class="quality4">{pvpVaultItemLevel[progress.level]}</span>
                {:else}
                    <span>{toNiceNumber(progress.threshold - progress.progress)}</span>
                {/if}
            {/each}
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
