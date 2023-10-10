<script lang="ts">
    import { getVaultItemLevel } from '@/utils/mythic-plus'
    import { componentTooltip } from '@/shared/utils/tooltips'
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
    <td use:componentTooltip={{component: TooltipMythicPlusVault, props: { character }}}>
        <VaultShared
            progresses={mythicPlus}
            qualityFunc={(prog) => getVaultItemLevel(prog.level)[1]}
            textFunc={(prog) => prog.progress >= prog.threshold
                ? getVaultItemLevel(prog.level)[0].toString()
                : `${prog.threshold - prog.progress} !`}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
