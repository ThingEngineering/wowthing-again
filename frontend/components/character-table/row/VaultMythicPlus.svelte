<script lang="ts">
    import { Constants } from '@/data/constants'
    import type {Character, CharacterWeeklyProgress} from '@/types'
    import getMythicPlusVaultItemLevel from '@/utils/get-mythic-plus-vault-item-level'
    import {tippyComponent} from '@/utils/tippy'

    import MythicPlusVaultTooltip from '@/tooltips/mythic-plus-vault/Tooltip.svelte'

    export let character: Character

    let mythicPlus: CharacterWeeklyProgress[] | undefined
    $: {
        if (character.level === Constants.characterMaxLevel) {
            mythicPlus = character.weekly?.vault?.mythicPlusProgress
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault, $paddingRight: $width-spacer);

        border-left: 1px solid $border-color;
    }
    span {
        display: inline-block;
        text-align: center;
        width: calc(#{$width-vault} / 3 - 0.2rem);
        word-spacing: -0.2ch;
    }
</style>

{#if mythicPlus}
    <td use:tippyComponent={{component: MythicPlusVaultTooltip, props: {character}}}>
        <div class="flex-wrapper">
            {#each mythicPlus as progress}
                {#if progress.progress >= progress.threshold}
                    <span class="quality4">{getMythicPlusVaultItemLevel(progress.level)}</span>
                {:else}
                    <span>{progress.threshold - progress.progress} !</span>
                {/if}
            {/each}
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
