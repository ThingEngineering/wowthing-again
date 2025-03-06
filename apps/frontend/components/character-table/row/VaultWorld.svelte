<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { getWorldTier } from '@/utils/vault/get-world-tier';
    import { Character, CharacterWeeklyProgress } from '@/types';

    import TooltipVaultWorld from '@/components/tooltips/vault-world/TooltipVaultWorld.svelte';
    import VaultShared from './VaultShared.svelte';

    export let character: Character;

    $: worldVault = character.isMaxLevel ? character.weekly?.vault?.worldProgress : [];

    function qualityFunc(prog: CharacterWeeklyProgress): number {
        return getWorldTier(prog.level)[1];
    }
    function textFunc(prog: CharacterWeeklyProgress): string {
        if (prog.progress >= prog.threshold) {
            return getWorldTier(prog.level)[0].toString();
        } else {
            return `${prog.threshold - prog.progress} !`;
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault);

        border-left: 1px solid $border-color;
    }
</style>

{#if worldVault?.length > 0}
    <td use:componentTooltip={{ component: TooltipVaultWorld, props: { character } }}>
        <VaultShared
            availableRewards={character.weekly?.vault.availableRewards}
            generatedRewards={character.weekly?.vault.generatedRewards}
            progresses={worldVault}
            {qualityFunc}
            {textFunc}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
