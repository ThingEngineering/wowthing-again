<script lang="ts">
    import { RewardType } from '@/enums/reward-type'
    import { staticStore } from '@/shared/stores/static'
    import { timeStore } from '@/stores/time'
    import { userQuestStore, userStore } from '@/stores'
    import type { ApiWorldQuest } from './types'
    import type { Character } from '@/types/character'

    import { toNiceDuration } from '@/utils/formatting'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import { worldQuestPrereqs } from './data';

    export let worldQuest: ApiWorldQuest

    $: bestRewards = worldQuest.rewards[0][1]
    $: millis = worldQuest.expires.diff($timeStore).toMillis()

    let characters: string
    $: {
        let validCharacters = $userStore.characters.filter((char) => char.level >= 60)
        if (worldQuestPrereqs[worldQuest.questId]) {
            validCharacters = validCharacters.filter(
                (char) => userQuestStore.hasAny(char.id, worldQuestPrereqs[worldQuest.questId]))
        }

        const complete: Character[] = []
        const incomplete: Character[] = []

        for (const character of validCharacters) {
            if (userQuestStore.hasAny(character.id, worldQuest.questId)) {
                complete.push(character)
            }
            else {
                incomplete.push(character)
            }
        }

        complete.sort((a, b) => a.name.localeCompare(b.name))
        incomplete.sort((a, b) => a.name.localeCompare(b.name))

        characters = [
            ...incomplete.map((c) => `<span class="class-${c.classId}">${c.name}</span>`),
            ...complete.map((c) => `<span class="class-${c.classId} completed">${c.name}</span>`)
        ].join(' ')
    }
</script>

<style lang="scss">
    table {
        margin: 0 auto;
        width: auto;
    }
    .amount {
        max-width: 5rem;
        text-align: right;
        white-space: nowrap;
        width: 2rem;
    }
    .name {
        max-width: 15rem;
        padding-left: 0;
        text-align: left;
        white-space: nowrap;
        width: 2rem;
    }
    .characters {
        font-size: 95%;
        text-align: left;
        width: 25rem;

        :global(span.completed) {
            text-decoration: line-through 3px;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>Quest #{worldQuest.questId}</h4>
    <h5>Expires in {toNiceDuration(millis)}</h5>
    <table class="table table-striped">
        <tbody>
            {#each bestRewards as reward}
                <tr>
                    <td class="amount">
                        {#if reward.type === RewardType.Currency && reward.id === 0}
                            {Math.floor(reward.amount / 10000).toLocaleString()}
                        {:else}
                            {reward.amount.toLocaleString()}x
                        {/if}
                    </td>
                    <td class="name text-overflow">
                        {#if reward.type === RewardType.Currency}
                            {#if reward.id === 0}
                                gold
                            {:else}
                                {$staticStore.currencies[reward.id]?.name}
                            {/if}
                        {:else if reward.type === RewardType.Item}
                            <ParsedText text={`{item:${reward.id}}`} />
                        {/if}
                    </td>
                </tr>
            {/each}
            <tr>
                <td colspan="2" class="characters">
                    {@html characters}
                </td>
            </tr>
        </tbody>
    </table>
</div>
