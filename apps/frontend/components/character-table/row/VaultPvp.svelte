<script lang="ts">
    import { pvpVaultItemLevel } from '@/data/pvp'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'

    import VaultShared from './VaultShared.svelte'

    export let character: Character

    $: pvpVault = character.isMaxLevel ? character.weekly?.vault?.rankedPvpProgress : []
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault);

        border-left: 1px solid $border-color;
    }
</style>

<td>
    {#if pvpVault?.length > 0}
        <VaultShared
            hasRewards={character.weekly?.vaultHasRewards}
            progresses={pvpVault}
            textFunc={(prog) => prog.progress >= prog.threshold
                ? pvpVaultItemLevel[prog.level].toString()
                : toNiceNumber(prog.threshold - prog.progress)}
        />
    {:else}
        &nbsp;
    {/if}
</td>
