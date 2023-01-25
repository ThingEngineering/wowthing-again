<script lang="ts">
    import getMythicPlusVaultItemLevel from '@/utils/get-mythic-plus-vault-item-level'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import TooltipMythicPlusVault from '@/components/tooltips/vault-mythic-plus/TooltipVaultMythicPlus.svelte'
    import VaultShared from './VaultShared.svelte'

    export let character: Character

    $: mythicPlus = character.isMaxLevel ? character.weekly?.vault?.mythicPlusProgress : []
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault);

        border-left: 1px solid $border-color;
    }
</style>

{#if mythicPlus?.length > 0}
    <td use:tippyComponent={{component: TooltipMythicPlusVault, props: { character }}}>
        <VaultShared
            progresses={mythicPlus}
            textFunc={(prog) => prog.progress >= prog.threshold
                ? getMythicPlusVaultItemLevel(prog.level).toString()
                : `${prog.threshold - prog.progress} !`}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
