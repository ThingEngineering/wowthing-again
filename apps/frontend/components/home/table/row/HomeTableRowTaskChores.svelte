<script lang="ts">
    import { multiTaskMap } from '@/data/tasks';
    import { activeView } from '@/shared/stores/settings';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyStore } from '@/stores';
    import type { LazyCharacterChore } from '@/stores/lazy/character';
    import type { Character } from '@/types';

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import { uiIcons } from '@/shared/icons/ui';

    export let character: Character;
    export let taskName: string;

    let chore: LazyCharacterChore;
    let inProgress: boolean;
    $: {
        const lazyCharacter = $lazyStore.characters[character.id];
        chore = lazyCharacter.chores[`${$activeView.id}|${taskName}`];
        inProgress = false;

        if (chore && multiTaskMap[taskName]) {
            inProgress = chore?.tasks?.every((taskData) => {
                const oof = (multiTaskMap[taskName] || []).filter(
                    (multi) => multi?.taskName === taskData?.name,
                )[0];
                return oof?.noProgress === true || taskData?.status > 0;
            });
        }
    }
</script>

<style lang="scss">
    td {
        --width: $width-weekly-quest;

        text-align: center;
        word-spacing: -0.2ch;
    }
    .ready {
        box-shadow: inset 0 0 0 1px var(--color-shrug);
    }
</style>

{#if chore?.countTotal === 0}
    <td
        class="sized b-l status-fail"
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore,
                taskName,
            },
        }}
    >
        ---
    </td>
{:else if chore?.tasks?.length > 0}
    {@const notStarted = chore.countTotal - chore.countCompleted - chore.countStarted}
    <td
        class="sized b-l"
        class:status-fail={!inProgress && notStarted > 0}
        class:status-shrug={inProgress ||
            (notStarted === 0 && chore.countCompleted < chore.countTotal)}
        class:status-success={chore.countCompleted === chore.countTotal}
        class:ready={chore.anyReady}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore,
                taskName,
            },
        }}
    >
        {#if multiTaskMap[taskName]?.length === 1}
            {#if chore.countCompleted === 1}
                <IconifyIcon icon={uiIcons.starFull} />
            {:else if !inProgress}
                <IconifyIcon icon={uiIcons.starEmpty} />
            {:else}
                {chore.countCompleted} / {chore.countTotal}
            {/if}
        {:else}
            {chore.countCompleted} / {chore.countTotal}
        {/if}
    </td>
{:else}
    <td class="b-l"></td>
{/if}
