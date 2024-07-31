<script lang="ts">
    import { multiTaskMap } from '@/data/tasks';
    import { activeView } from '@/shared/stores/settings'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { lazyStore } from '@/stores'
    import type { LazyCharacterChore } from '@/stores/lazy/character'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte'

    export let character: Character
    export let taskName: string

    let chore: LazyCharacterChore
    let inProgress: boolean
    $: {
        const lazyCharacter = $lazyStore.characters[character.id]
        chore = lazyCharacter.chores[`${$activeView.id}|${taskName}`]
        inProgress = false

        if (chore && multiTaskMap[taskName]) {
            inProgress = chore?.tasks?.every((taskData) => {
                const oof = multiTaskMap[taskName].filter((multi) => multi.taskName === taskData.name)[0]
                return oof?.noProgress === true || taskData.status > 0
            })
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid $border-color;
        text-align: center;
        word-spacing: -0.2ch;
    }
</style>

{#if chore?.countTotal === 0}
    <td
        class="status-fail"
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
        class:status-fail={!inProgress && notStarted > 0}
        class:status-shrug={inProgress || (notStarted === 0 && chore.countCompleted < chore.countTotal)}
        class:status-success={chore.countCompleted === chore.countTotal}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore,
                taskName,
            },
        }}
    >
        {chore.countCompleted} / {chore.countTotal}
    </td>
{:else}
    <td></td>
{/if}
