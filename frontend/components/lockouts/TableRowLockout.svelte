<script lang="ts">
    import type {Character, CharacterLockout, InstanceDifficulty} from '@/types'
    import { tippyComponent } from '@/utils/tippy'

    import LockoutTooltip from '@/tooltips/lockout/Tooltip.svelte'

    export let character: Character
    export let instanceDifficulty: InstanceDifficulty

    let lockout: CharacterLockout
    $: {
        lockout = character.lockouts?.[instanceDifficulty.key]
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-lockout);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if lockout}
    <td use:tippyComponent={{component: LockoutTooltip, props: {character, lockout}}}>
        <span>{lockout.defeatedBosses}</span>
        <span>/</span>
        <span>{lockout.maxBosses}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
