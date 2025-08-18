<script lang="ts">
    import groupBy from 'lodash/groupBy';
    import orderBy from 'lodash/orderBy';

    import { timeState } from '@/shared/state/time.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { zoneMap } from '@/user-home/components/world-quests/data';
    import { worldQuestStore } from '@/user-home/components/world-quests/store';
    import { userState } from '@/user-home/state/user';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { CharacterProps } from '@/types/props';
    import type { ApiWorldQuest } from '@/user-home/components/world-quests/types';

    import Tooltip from '@/components/tooltips/GoldWorldQuests.svelte';

    let { character }: CharacterProps = $props();

    let now = $derived(timeState.time.toUnixInteger());
    let goldWorldQuests = $derived(
        (userState.quests.characterById.get(character.id)?.goldWorldQuests || []).filter(
            ([, expires]) => expires > now
        )
    );
    let questMap = $derived(
        Object.fromEntries(goldWorldQuests.map(([questId, , gold]) => [questId, gold]))
    );

    // zoneId: worldQuest[]
    function processQuests(
        worldQuests: Record<number, ApiWorldQuest[]>,
        questMap: Record<number, number>
    ): [number, [number, number, number, number][]] {
        let count = 0;
        let active: [number, number, number, number][] = [];

        const blah: [number, ApiWorldQuest][] = [];
        for (const [zoneId, zoneQuests] of getNumberKeyedEntries(worldQuests)) {
            for (const zoneQuest of zoneQuests) {
                // const worldQuest = wowthingData.static.worldQuestById.get(zoneQuest.questId);
                // const questInfo = wowthingData.static.questInfoById.get(worldQuest?.questInfoId);
                // if (worldQuest?.expansion >= 10 && questInfo?.type === QuestInfoType.WorldBoss) {
                //     continue;
                // }

                // Undermine + K'aresh world bosses change reward all the damn time, skip them
                if (![85088, 87354].includes(zoneQuest.questId)) {
                    blah.push([zoneId, zoneQuest]);
                }
            }
        }

        const grouped = getNumberKeyedEntries(
            groupBy(blah, ([, worldQuest]) => worldQuest.questId)
        ).map(([questId, zoneQuests]) => [
            questId,
            orderBy(zoneQuests, ([zoneId]) => (zoneMap[zoneId]?.name ? 0 : 1)),
        ]) as [number, [number, ApiWorldQuest][]][];

        for (const [, groupedQuests] of grouped) {
            const [zoneId, worldQuest] = groupedQuests[0];
            if (
                questMap[worldQuest.questId] &&
                !userState.quests.characterById
                    .get(character.id)
                    .hasQuestById.has(worldQuest.questId)
            ) {
                const expires = worldQuest.expires.diff(timeState.time).toMillis();
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

        active = orderBy(active, ([zoneId]) => zoneMap[zoneId]?.name || `Zone #${zoneId}`);

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
