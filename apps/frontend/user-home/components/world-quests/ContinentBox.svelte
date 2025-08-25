<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { wowthingData } from '@/shared/stores/data';
    import { leftPad } from '@/utils/formatting';
    import type { ApiWorldQuest, WorldQuestZone } from './types';

    import WorldQuest from './WorldQuest.svelte';

    type Props = {
        worldQuests: ApiWorldQuest[];
        zone: WorldQuestZone;
    };
    let { worldQuests, zone }: Props = $props();

    let sortedQuests = $derived(
        sortBy(worldQuests, (worldQuest) => [worldQuest.expires, sortFields(worldQuest)].join('|'))
    );

    const sortFields = (worldQuest: ApiWorldQuest): string => {
        const reward = worldQuest.rewards[0][1][0];

        const faction: number =
            ((wowthingData.static.worldQuestById.get(worldQuest.questId)?.faction ?? 2) + 1) % 3;

        // Currency
        const parts: string[] = [
            reward.type === 11 && reward.id === 0 ? '0' : '1',
            faction.toString(),
            leftPad(1_000_000_000 - reward.amount, 10, '0'),
            leftPad(reward.id, 7, '0'),
        ];
        return parts.join(':');
    };
</script>

<style lang="scss">
    .zone-quests {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem 0.4rem;
        max-width: calc(0.2rem + (5 * 36px) + (4 * 0.4rem) + 2px);
        position: absolute;

        :global(> .world-quest) {
            left: unset;
            position: relative;
            top: unset;
            transform: none;
        }
    }
</style>

<div
    class="zone-quests"
    style:bottom={zone.anchor === 'bottom-left' || zone.anchor === 'bottom-right'
        ? `${100 - zone.continentPoint[1]}%`
        : undefined}
    style:left={zone.anchor === 'top-left' || zone.anchor === 'bottom-left'
        ? `${zone.continentPoint[0]}%`
        : undefined}
    style:right={zone.anchor === 'top-right' || zone.anchor === 'bottom-right'
        ? `${100 - zone.continentPoint[0]}%`
        : undefined}
    style:top={zone.anchor === 'top-left' || zone.anchor === 'top-right'
        ? `${zone.continentPoint[1]}%`
        : undefined}
>
    {#each sortedQuests as worldQuest (worldQuest.questId)}
        <WorldQuest {worldQuest} />
    {/each}
</div>
