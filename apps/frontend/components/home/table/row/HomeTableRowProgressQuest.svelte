<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyStore } from '@/stores';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/progress-quest/TooltipProgressQuest.svelte';

    let { character, quest, title }: CharacterProps & { quest: string; title: string } = $props();

    let charTask = $derived(
        $lazyStore.characters[character.id].tasks[`${settingsState.activeView.id}|${quest}`]
    );

    let status = $derived(charTask?.status);
</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid var(--border-color);
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
        data-quest={quest}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                progressQuest: charTask.quest,
                title,
            },
        }}>{charTask.text}</td
    >
{:else}
    <td>&nbsp;</td>
{/if}
