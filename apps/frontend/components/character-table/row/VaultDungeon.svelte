<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { getVaultItemLevel } from '@/utils/mythic-plus'
    import { getDungeonLevel } from '@/utils/mythic-plus/get-dungeon-level'
    import type { Character, CharacterWeeklyProgress } from '@/types'

    import TooltipMythicPlusVault from '@/components/tooltips/vault-mythic-plus/TooltipVaultMythicPlus.svelte'
    import VaultShared from './VaultShared.svelte'

    export let character: Character

    $: mythicPlus = character.isMaxLevel ? character.weekly?.vault?.dungeonProgress : []
    
    function qualityFunc(prog: CharacterWeeklyProgress): number {
        return getVaultItemLevel(getDungeonLevel(prog))[1]
    }
    function textFunc(prog: CharacterWeeklyProgress): string {
        if (prog.progress >= prog.threshold) {
            return getVaultItemLevel(getDungeonLevel(prog))[0].toString()
        }
        else {
            return `${prog.threshold - prog.progress} !`
        }
    }
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
