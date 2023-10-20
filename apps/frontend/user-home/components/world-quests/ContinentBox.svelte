<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import type { ApiWorldQuest, WorldQuestZone } from './types'

    import WorldQuest from './WorldQuest.svelte'
    import { leftPad } from '@/utils/formatting';

    export let worldQuests: ApiWorldQuest[]
    export let zone: WorldQuestZone

    $: sortedQuests = sortBy(
        worldQuests,
        (worldQuest) => [
            worldQuest.expires,
            ...sortFields(worldQuest)
        ]
    )

    const sortFields = (worldQuest: ApiWorldQuest): string => {
        const reward = worldQuest.rewards[0][1][0]
        const parts: number[] = []

        if (reward.type === 11) {
            parts.push(0)
            parts.push(reward.id)
            parts.push(1_000_000_000 - reward.amount)
        }
        else {
            parts.push(1)
            parts.push(1_000_000_000 - reward.amount)
            parts.push(reward.id)
        }

        return parts.map((part) => leftPad(part, 6, '0')).join(':')
    }
</script>

<style lang="scss">
    .zone-quests {
        display: flex;
        flex-wrap: wrap;
        gap: 0.2rem 0.4rem;
        max-width: calc(0.2rem + (6 * 36px) + (5 * 0.4rem) + 2px);
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
    style:bottom={zone.anchor === 'bottom-left' || zone.anchor === 'bottom-right' ? `${100 - zone.continentPoint[1]}%` : undefined}
    style:left={zone.anchor === 'top-left' || zone.anchor === 'bottom-left' ? `${zone.continentPoint[0]}%` : undefined}
    style:right={zone.anchor === 'top-right' || zone.anchor === 'bottom-right' ? `${100 - zone.continentPoint[0]}%` : undefined}
    style:top={zone.anchor === 'top-left' || zone.anchor === 'top-right' ? `${zone.continentPoint[1]}%` : undefined}
>
    {#each sortedQuests as worldQuest}
        <WorldQuest {worldQuest} />
    {/each}
</div>
