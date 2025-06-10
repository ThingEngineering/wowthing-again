<script lang="ts">
    import { Faction } from '@/enums/faction';
    import { RewardType } from '@/enums/reward-type';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { userQuestStore, userStore } from '@/stores';
    import { toNiceDuration } from '@/utils/formatting';
    import type { Character } from '@/types/character';

    import { worldQuestPrereqs } from './data';
    import type { ApiWorldQuest } from './types';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';

    let { worldQuest }: { worldQuest: ApiWorldQuest } = $props();

    let bestRewards = $derived(worldQuest.rewards[0][1]);
    let millis = $derived.by(() => worldQuest.expires.diff($timeStore).toMillis());
    let staticWorldQuest = $derived.by(() =>
        wowthingData.static.worldQuestById.get(worldQuest.questId)
    );
    let questInfo = $derived.by(() =>
        wowthingData.static.questInfoById.get(staticWorldQuest?.questInfoId)
    );

    let characters = $derived.by(() => {
        let validCharacters = $userStore.characters.filter((char) => char.level >= 60);

        if (staticWorldQuest) {
            if (staticWorldQuest.minLevel) {
                validCharacters = validCharacters.filter(
                    (char) => char.level >= staticWorldQuest.minLevel
                );
            }

            // TODO check all? one?
            if (staticWorldQuest.needQuestIds) {
                validCharacters = validCharacters.filter((char) =>
                    userQuestStore.hasAny(char.id, staticWorldQuest.needQuestIds[0])
                );
            }
        }

        if (worldQuestPrereqs[worldQuest.questId]) {
            validCharacters = validCharacters.filter((char) =>
                userQuestStore.hasAny(char.id, worldQuestPrereqs[worldQuest.questId])
            );
        }

        const complete: Character[] = [];
        const incomplete: Character[] = [];

        for (const character of validCharacters) {
            if (userQuestStore.hasAny(character.id, worldQuest.questId)) {
                complete.push(character);
            } else {
                incomplete.push(character);
            }
        }

        complete.sort((a, b) => a.name.localeCompare(b.name));
        incomplete.sort((a, b) => a.name.localeCompare(b.name));

        return [
            ...incomplete.map((c) => `<span class="class-${c.classId}">${c.name}</span>`),
            ...complete.map((c) => `<span class="class-${c.classId} completed">${c.name}</span>`),
        ].join(' ');
    });
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
    }
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
    <h4>
        {#if staticWorldQuest && staticWorldQuest.faction !== Faction.Neutral}
            <FactionIcon faction={staticWorldQuest.faction} size={16} />
        {/if}
        {staticWorldQuest?.name || `Quest #${worldQuest.questId}`}
    </h4>
    <h5>
        {#if questInfo}
            {questInfo.name} -
        {/if}
        {toNiceDuration(millis).replace(/&nbsp;/g, '')} remaining
    </h5>
    <table class="table table-striped">
        <tbody>
            {#each bestRewards as reward (reward)}
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
                                {wowthingData.static.currencyById.get(reward.id)?.name}
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
