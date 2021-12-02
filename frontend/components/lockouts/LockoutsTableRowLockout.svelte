<script lang="ts">
    import mdiCheck from '@iconify/icons-mdi/check'

    import { lockoutOverride } from '@/data/dungeon'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterLockout, InstanceDifficulty } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import TooltipLockout from '@/components/tooltips/lockout/TooltipLockout.svelte'

    export let character: Character
    export let instanceDifficulty: InstanceDifficulty
    export let showNumbers = true

    let lockout: CharacterLockout
    let maxBosses: number
    $: {
        lockout = character.lockouts?.[instanceDifficulty?.key]
        maxBosses = lockoutOverride[instanceDifficulty.instanceId] || lockout.maxBosses
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-lockout - var(--less-width, 0px));

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if lockout}
    <td
        use:tippyComponent={{component: TooltipLockout, props: {character, lockout}}}
        class:status-success={lockout.defeatedBosses >= maxBosses}
        class:status-shrug={lockout.defeatedBosses < maxBosses}
        style="{!showNumbers ? '--less-width: 0.8rem;' : ''}"
    >
        {#if showNumbers}
            <span>{lockout.defeatedBosses}</span>
            <span>/</span>
            <span>{maxBosses}</span>
        {:else}
            {#if lockout.defeatedBosses >= maxBosses}
                <IconifyIcon icon={mdiCheck} />
            {/if}
        {/if}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
