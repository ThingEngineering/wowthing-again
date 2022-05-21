<script lang="ts">
    import type { Character } from '@/types'
    import type { UserQuestDataCharacterProgress } from '@/types/data'
    import type { StaticDataProgressGroup } from '@/types/data/static'

    export let character: Character
    export let group: StaticDataProgressGroup
    export let progresses: {cls: string, completed: boolean, difficulty: string, progressQuest: UserQuestDataCharacterProgress}[]
</script>

<style lang="scss">
    .difficulty {
        text-align: left;

        &::first-letter {
            text-transform: capitalize;
        }
    }
    .status {
        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{group.name}</h5>

    <table class="table-striped">
        <tbody>
            {#each progresses as progress}
                <tr>
                    <td class="difficulty">{progress.difficulty}</td>
                    <td class="status">
                        <span class="{progress.cls} drop-shadow">
                            {#if progress.completed}
                                Completed
                            {:else if progress.progressQuest === undefined}
                                Not started
                            {:else}
                                {progress.progressQuest.have} / {progress.progressQuest.need}
                            {/if}
                        </span>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
