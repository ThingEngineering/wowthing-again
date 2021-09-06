<script lang="ts">
    import type {Character, CharacterLockout, InstanceDifficulty} from '@/types'
    import { tippyComponent } from '@/utils/tippy'

    import TooltipLockout from '@/components/tooltips/lockout/TooltipLockout.svelte'

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
    <td use:tippyComponent={{component: TooltipLockout, props: {character, lockout}}}
        class:status-success={lockout.defeatedBosses >= lockout.maxBosses}
        class:status-shrug={lockout.defeatedBosses < lockout.maxBosses}>
        <span>{lockout.defeatedBosses}</span>
        <span>/</span>
        <span>{lockout.maxBosses}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
