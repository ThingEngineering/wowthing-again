<script lang="ts">
    import { lazyStore } from '@/stores'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { LazyCharacterChore } from '@/stores/lazy/character'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte'

    export let character: Character
    export let taskName: string

    let chore: LazyCharacterChore
    $: {
        const lazyCharacter = $lazyStore.characters[character.id]
        chore = lazyCharacter.chores[taskName]
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
    <td
        class:status-fail={chore.countCompleted === 0}
        class:status-shrug={chore.countCompleted < chore.countTotal}
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
