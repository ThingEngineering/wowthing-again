<script lang="ts">
    import { timeStore } from '@/shared/stores/time';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userQuestStore } from '@/stores';
    import { worldQuestStore } from '@/user-home/components/world-quests/store';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { Character } from '@/types';
    import type { ApiWorldQuest } from '@/user-home/components/world-quests/types';

    import Tooltip from '@/components/tooltips/GoldWorldQuests.svelte';

    export let character: Character;

    let goldWorldQuests: [number, number, number][];
    let questMap: Record<number, number>;

    $: {
        const now = $timeStore.toUnixInteger();
        goldWorldQuests = ($userQuestStore.characters[character.id]?.goldWorldQuests || []).filter(
            ([, expires]) => expires > now,
        );
        questMap = Object.fromEntries(goldWorldQuests.map(([questId, , gold]) => [questId, gold]));
    }

    // zoneId: worldQuest[]
    function processQuests(
        worldQuests: Record<number, ApiWorldQuest[]>,
        questMap: Record<number, number>,
    ): [number, [number, number, number, number][]] {
        let count = 0;
        let active: [number, number, number, number][] = [];
        for (const [zoneId, zoneQuests] of getNumberKeyedEntries(worldQuests)) {
            for (const worldQuest of zoneQuests) {
                if (
                    questMap[worldQuest.questId] &&
                    !userQuestStore.hasAny(character.id, worldQuest.questId)
                ) {
                    const expires = worldQuest.expires.diff($timeStore).toMillis();
                    if (expires > 0) {
                        active.push([
                            zoneId,
                            worldQuest.questId,
                            expires,
                            questMap[worldQuest.questId],
                        ]);
                        count++;
                    }
                }
            }
        }
        return [count, active];
    }
</script>

<style lang="scss">
    td {
        --width: 3rem;

        text-align: center;
    }
</style>

<td class="sized b-l">
    {#if goldWorldQuests?.length > 0}
        {#await worldQuestStore.fetch(character.realm.region)}
            ...
        {:then worldQuests}
            {@const [count, active] = processQuests(worldQuests, questMap)}
            <div
                use:componentTooltip={{
                    component: Tooltip,
                    props: { active, character },
                }}
            >
                {count}
            </div>
        {/await}
    {:else}
        ---
    {/if}
</td>
