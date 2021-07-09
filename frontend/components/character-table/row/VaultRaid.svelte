<script lang="ts">
    import {Constants} from '@/data/constants'
    import type {Character, CharacterWeeklyProgress} from '@/types'
    import getRaidVaultItemLevel from '@/utils/get-raid-vault-item-level';
    import { tippyComponent } from '@/utils/tippy'

    import TooltipVaultRaid from '@/tooltips/vault-raid/Tooltip.svelte'

    export let character: Character

    let raidVault: CharacterWeeklyProgress[] | undefined
    $: {
        if (character.level === Constants.characterMaxLevel) {
            raidVault = character.weekly?.vault?.raidProgress
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

{#if raidVault}
    <td use:tippyComponent={{component: TooltipVaultRaid, props: {character}}}>
        <div class="flex-wrapper">
            {#each raidVault as progress}
                {#if progress.progress >= progress.threshold}
                    <span class="quality4">{getRaidVaultItemLevel(progress)}</span>
                {:else}
                    <span>{progress.threshold - progress.progress} !</span>
                {/if}
            {/each}
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
