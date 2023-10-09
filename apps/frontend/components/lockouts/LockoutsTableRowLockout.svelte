<script lang="ts">
    import { lockoutOverride } from '@/data/dungeon'
    import { iconStrings } from '@/data/icons'
    import { settingsStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterLockout, InstanceDifficulty } from '@/types'

    import IconifyIcon from '@/shared/images/IconifyIcon.svelte'
    import TooltipLockout from '@/components/tooltips/lockout/TooltipLockout.svelte'

    export let character: Character
    export let instanceDifficulty: InstanceDifficulty
    export let showNumbers = true

    let lockout: CharacterLockout
    let maxBosses: number
    $: {
        if (instanceDifficulty) {
            lockout = character.lockouts?.[instanceDifficulty.key]
            if (lockout) {
                maxBosses = lockoutOverride[instanceDifficulty.instanceId] || lockout.maxBosses
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-lockout - var(--less-width, 0px));

        border-left: 1px solid $border-color;
        text-align: center;

        :global(svg) {
            margin-top: -4px;
        }
    }
</style>

{#if lockout}
    <td
        use:tippyComponent={{component: TooltipLockout, props: {character, lockout}}}
        class:status-success={lockout.defeatedBosses >= maxBosses}
        class:status-shrug={lockout.defeatedBosses > 0 && lockout.defeatedBosses < maxBosses}
        class:status-fail={lockout.defeatedBosses === 0}
        style="{!showNumbers ? '--less-width: 0.8rem;' : ''}"
    >
        {#if showNumbers}
            <span>{lockout.defeatedBosses}</span>
            <span>/</span>
            <span>{maxBosses}</span>
        {:else}
            {#if lockout?.defeatedBosses >= maxBosses}
                <IconifyIcon icon={iconStrings.starFull} />
            {:else if lockout?.defeatedBosses > 0}
                <IconifyIcon icon={iconStrings.starHalf} />
            {:else if $settingsStore.layout.showEmptyLockouts}
                <IconifyIcon icon={iconStrings.starEmpty} />
            {/if}
        {/if}
    </td>
{:else}
    <td class="status-fail">
        {#if $settingsStore.layout.showEmptyLockouts}
            <IconifyIcon icon={iconStrings.starEmpty} />
        {/if}
    </td>
{/if}
