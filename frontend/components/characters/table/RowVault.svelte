<script lang="ts">
    import { getContext } from 'svelte'

    import { Constants } from '@/data/constants'
    import type {
        Character,
        CharacterWeeklyProgress,
        TippyProps,
    } from '@/types'
    import getMythicPlusVaultItemLevel from '@/utils/get-mythic-plus-vault-item-level'
    import getMythicPlusVaultTooltip from '@/utils/get-mythic-plus-vault-tooltip'
    import tippy from '@/utils/tippy'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

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
        text-align: center;
        width: 2.3rem;
    }
</style>

{#if mythicPlus}
    <TableIcon>
        <WowthingImage name="idk_keystone" size={20} border={1} />
    </TableIcon>
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
    <td colspan="4" />
{/if}
