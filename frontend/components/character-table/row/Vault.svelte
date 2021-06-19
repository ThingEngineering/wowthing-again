<script lang="ts">
    import { Constants } from '@/data/constants'
    import type {
        Character,
        CharacterWeeklyProgress,
        TippyProps,
    } from '@/types'
    import getMythicPlusVaultItemLevel from '@/utils/get-mythic-plus-vault-item-level'
    import getMythicPlusVaultTooltip from '@/utils/get-mythic-plus-vault-tooltip'
    import tippy from '@/utils/tippy'

    export let character: Character

    let mythicPlus: CharacterWeeklyProgress[] | undefined
    let mythicPlusTooltip: TippyProps
    $: {
        if (character.level === Constants.characterMaxLevel) {
            mythicPlus = character.weekly?.vault?.mythicPlusProgress
            if (mythicPlus) {
                mythicPlusTooltip = getMythicPlusVaultTooltip(character)
            }
        }
    }
</script>

<style lang="scss">
    td {
        min-width: $character-width-vault;
        width: $character-width-vault;
        text-align: center;
    }
</style>

{#if mythicPlus}
    {#each mythicPlus as progress}
        {#if progress.progress >= progress.threshold}
            <td class="quality4" use:tippy={mythicPlusTooltip}
                >{getMythicPlusVaultItemLevel(progress.level)}</td
            >
        {:else}
            <td use:tippy={mythicPlusTooltip}
                >{progress.threshold - progress.progress} !</td
            >
        {/if}
    {/each}
{:else}
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
{/if}
