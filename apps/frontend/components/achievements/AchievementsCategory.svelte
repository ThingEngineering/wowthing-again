<script lang="ts">
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'

    import { achievementStore, userAchievementStore } from '@/stores'
    import type { AchievementDataCategory } from '@/types'
    import leftPad from '@/utils/left-pad'

    import AchievementsAchievement from './AchievementsAchievement.svelte'

    export let slug1: string
    export let slug2: string

    let achievementIds: number[]
    let category: AchievementDataCategory
    $: {
        console.time('AchievementsCategory computed')
        category = find($achievementStore.data.categories, (c) => c.slug === slug1)
        if (slug2) {
            category = find(category.children, (c) => c.slug === slug2)
        }

        achievementIds = sortBy(category.achievementIds, id => [
            $userAchievementStore.data.achievements[id] === undefined ? '1' : '0',
            leftPad($achievementStore.data.achievement[id].order, 4, '0'),
            leftPad(100000 - id, 6, '0')
        ].join('|'))
        console.timeEnd('AchievementsCategory computed')
    }
</script>

<style lang="scss">
    .achievements {
        width: 100%;

        @media screen and (min-width: 1600px) {
            align-items: flex-start;
            column-gap: 1rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }
</style>

{#if category && achievementIds}
    <div class="achievements">
        {#each achievementIds as achievementId (achievementId)}
            <AchievementsAchievement {achievementId} />
        {/each}
    </div>
{/if}
