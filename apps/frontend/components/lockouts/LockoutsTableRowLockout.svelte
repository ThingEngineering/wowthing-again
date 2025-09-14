<script lang="ts">
    import { lockoutOverride } from '@/data/dungeon';
    import { uiIcons } from '@/shared/icons';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { CharacterLockout, InstanceDifficulty } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import TooltipLockout from '@/components/tooltips/lockout/TooltipLockout.svelte';

    type Props = CharacterProps & {
        instanceDifficulty: InstanceDifficulty;
        showNumbers?: boolean;
        striped?: boolean;
    };
    let { character, instanceDifficulty, showNumbers = true, striped = false }: Props = $props();

    let lockout: CharacterLockout = $derived.by(() => {
        if (instanceDifficulty) {
            // find any lockout difficulty if the key has no difficulty
            if (instanceDifficulty.key.endsWith('-')) {
                return Object.entries(character.lockouts).filter(([key]) =>
                    key.startsWith(instanceDifficulty.key)
                )[0]?.[1];
            } else {
                return character.lockouts?.[instanceDifficulty.key];
            }
        } else {
            return null;
        }
    });
    let maxBosses = $derived(
        lockout ? lockoutOverride[instanceDifficulty.instanceId] || lockout.maxBosses : 0
    );
</script>

<style lang="scss">
    td {
        --width: calc(3.5rem - var(--less-width, 0px)) border-left: 1px solid var(--border-color);
        text-align: center;

        :global(svg) {
            margin-top: -4px;
        }
    }
</style>

{#if lockout}
    <td
        class="sized"
        class:alt={!showNumbers && striped}
        class:status-success={lockout.defeatedBosses >= maxBosses}
        class:status-shrug={lockout.defeatedBosses > 0 && lockout.defeatedBosses < maxBosses}
        class:status-fail={lockout.defeatedBosses === 0}
        style={!showNumbers ? '--less-width: 0.8rem;' : ''}
        use:componentTooltip={{ component: TooltipLockout, props: { character, lockout } }}
    >
        {#if showNumbers}
            <span>{lockout.defeatedBosses}</span>
            <span>/</span>
            <span>{maxBosses}</span>
        {:else if lockout?.defeatedBosses >= maxBosses}
            <IconifyIcon icon={uiIcons.starFull} />
        {:else if lockout?.defeatedBosses > 0}
            <IconifyIcon icon={uiIcons.starHalf} />
        {:else if settingsState.value.layout.showEmptyLockouts}
            <IconifyIcon icon={uiIcons.starEmpty} />
        {/if}
    </td>
{:else}
    <td
        class="status-fail"
        class:alt={!showNumbers && striped}
        use:componentTooltip={{
            component: TooltipLockout,
            props: {
                character,
                instanceId: instanceDifficulty.instanceId,
                lockout,
            },
        }}
    >
        {#if settingsState.value.layout.showEmptyLockouts}
            <IconifyIcon icon={uiIcons.starEmpty} />
        {/if}
    </td>
{/if}
