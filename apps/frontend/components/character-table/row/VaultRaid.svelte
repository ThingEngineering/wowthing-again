<script lang="ts">
    import {Constants} from '@/data/constants'
    import getRaidVaultItemLevel from '@/utils/get-raid-vault-item-level'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import TooltipVaultRaid from '@/components/tooltips/vault-raid/TooltipVaultRaid.svelte'
    import VaultShared from './VaultShared.svelte'

    export let character: Character

    $: raidVault = character.isMaxLevel ? character.weekly?.vault?.rankedPvpProgress : []
    $: {
        if (character.level === Constants.characterMaxLevel) {
            raidVault = character.weekly?.vault?.raidProgress
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-vault);

        border-left: 1px solid $border-color;
    }
</style>

{#if raidVault?.length > 0}
    <td use:tippyComponent={{component: TooltipVaultRaid, props: {character}}}>
        <VaultShared
            progresses={raidVault}
            textFunc={(prog) => prog.progress >= prog.threshold
                ? getRaidVaultItemLevel(prog).toString()
                : `${prog.threshold - prog.progress} !`}
        />
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
