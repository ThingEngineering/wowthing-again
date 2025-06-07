<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { getVaultItemLevel } from '@/utils/mythic-plus';
    import { getDungeonLevel } from '@/utils/mythic-plus/get-dungeon-level';
    import type { CharacterWeeklyProgress } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import TooltipMythicPlusVault from '@/components/tooltips/vault-mythic-plus/TooltipVaultMythicPlus.svelte';
    import VaultShared from './VaultShared.svelte';

    let { character }: CharacterProps = $props();

    let mythicPlus = $derived(character.isMaxLevel ? character.weekly?.vault?.dungeonProgress : []);

    function qualityFunc(prog: CharacterWeeklyProgress): number {
        return getVaultItemLevel(getDungeonLevel(prog))[1];
    }
    function textFunc(prog: CharacterWeeklyProgress): string {
        if (prog.progress >= prog.threshold) {
            return getVaultItemLevel(getDungeonLevel(prog))[0].toString();
        } else {
            return `${prog.threshold - prog.progress} !`;
        }
    }
</script>

<style lang="scss">
    td {
        --width: var(--width-vault);
    }
</style>

{#if mythicPlus?.length > 0}
    <td
        use:componentTooltip={{ component: TooltipMythicPlusVault, props: { character } }}
        class="sized b-l"
    >
        <VaultShared
            availableRewards={character.weekly?.vault.availableRewards}
            generatedRewards={character.weekly?.vault.generatedRewards}
            progresses={mythicPlus}
            {qualityFunc}
            {textFunc}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
