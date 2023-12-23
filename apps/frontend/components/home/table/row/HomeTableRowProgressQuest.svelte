<script lang="ts">
    import { lazyStore } from '@/stores'
    import { settingsStore } from '@/shared/stores/settings'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/progress-quest/TooltipProgressQuest.svelte'

    export let character: Character
    export let quest: string
    export let title: string

    $: charTask = $lazyStore.characters[character.id]
        .tasks[`${$settingsStore.activeView}|${quest}`]

</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid $border-color;
        word-spacing: -0.2ch;

        &.center {
            text-align: center !important;
        }

        &.status-shrug {
            text-align: right;
        }

        &.status-turn-in {
            color: rgb(255, 0, 255);
        }
    }
</style>

{#if charTask}
    <td
        class="status-{charTask.status}"
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
