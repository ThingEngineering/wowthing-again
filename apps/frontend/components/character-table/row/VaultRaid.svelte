<script lang="ts">
    import getRaidVaultItemLevel from '@/utils/get-raid-vault-item-level';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    import TooltipVaultRaid from '@/components/tooltips/vault-raid/TooltipVaultRaid.svelte';
    import VaultShared from './VaultShared.svelte';

    let { character }: CharacterProps = $props();

    let raidVault = $derived(character.isMaxLevel ? character.weekly?.vault?.raidProgress : []);
</script>

<style lang="scss">
    td {
        --width: var(--width-vault);
    }
</style>

{#if raidVault?.length > 0}
    <td
        use:componentTooltip={{ component: TooltipVaultRaid, props: { character } }}
        class="sized b-l"
    >
        <VaultShared
            availableRewards={character.weekly?.vault.availableRewards}
            generatedRewards={character.weekly?.vault.generatedRewards}
            progresses={raidVault}
            qualityFunc={(prog) => getRaidVaultItemLevel(prog)[1]}
            textFunc={(prog) =>
                prog.progress >= prog.threshold
                    ? getRaidVaultItemLevel(prog)[0].toString()
                    : `${prog.threshold - prog.progress} !`}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
