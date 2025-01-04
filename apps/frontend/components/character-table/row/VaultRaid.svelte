<script lang="ts">
    import getRaidVaultItemLevel from '@/utils/get-raid-vault-item-level'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    import TooltipVaultRaid from '@/components/tooltips/vault-raid/TooltipVaultRaid.svelte'
    import VaultShared from './VaultShared.svelte'

    export let character: Character

    $: raidVault = character.isMaxLevel ? character.weekly?.vault?.raidProgress : []
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault);

        border-left: 1px solid $border-color;
    }
</style>

{#if raidVault?.length > 0}
    <td use:componentTooltip={{component: TooltipVaultRaid, props: {character}}}>
        <VaultShared
            availableRewards={character.weekly?.vault.availableRewards}
            generatedRewards={character.weekly?.vault.generatedRewards}
            progresses={raidVault}
            qualityFunc={(prog) => getRaidVaultItemLevel(prog)[1]}
            textFunc={(prog) => prog.progress >= prog.threshold
                ? getRaidVaultItemLevel(prog)[0].toString()
                : `${prog.threshold - prog.progress} !`}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
