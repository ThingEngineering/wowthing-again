<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import { QuestStatus } from '@/enums/quest-status';
    import { activeView } from '@/shared/stores/settings'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { lazyStore } from '@/stores'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/progress-quest/TooltipProgressQuest.svelte'

    export let character: Character
    export let quest: string
    export let title: string

    $: charTask = $lazyStore.characters[character.id].tasks[`${$activeView.id}|${quest}`]

    let status: string
    $: {
        status = charTask?.status
        if (charTask?.quest?.status === QuestStatus.InProgress && charTask.text !== '100 %') {
            const task = taskMap[quest]
            if (task.isCurrentFunc?.(character, charTask.quest.id) === false) {
                status = 'warn'
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid $border-color;
        word-spacing: -0.2ch;

        &.center {
            text-align: center !important;
        }
        &.status-shrug,
        &.status-warn {
            text-align: right;
        }
        &.status-turn-in {
            color: rgb(255, 0, 255);
        }
    }
</style>

{#if charTask}
    <td
        class="status-{status}"
        class:center={!charTask.text?.endsWith('%')}
        data-quest="{quest}"
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                progressQuest: charTask.quest,
                title,
            }
        }}
    >{charTask.text}</td>
{:else}
    <td>&nbsp;</td>
{/if}
