<script lang="ts">
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'
    import { replace } from 'svelte-spa-router'

    import { achievementStore, userAchievementStore } from '@/stores'
    import { achievementState } from '@/stores/local-storage'
    import type { AchievementDataCategory } from '@/types'
    import leftPad from '@/utils/left-pad'

    import AchievementsAchievement from './AchievementsAchievement.svelte'
    import Checkbox from '@/components/forms/CheckboxInput.svelte'

    export let slug1: string
    export let slug2: string

    let achievementIds: number[]
    let category: AchievementDataCategory
    $: {
        category = find($achievementStore.data.categories, (c) => c !== null && c.slug === slug1)
        if (slug2) {
            category = find(category.children, (c) => c !== null && c.slug === slug2)
        }
        else if (category.achievementIds.length === 0 && category.children.length > 0) {
            replace(`/achievements/${slug1}/${category.children[0].slug}`)
        }

        achievementIds = sortBy(category.achievementIds, id => [
            $userAchievementStore.data.achievements[id] === undefined ? '1' : '0',
            leftPad($achievementStore.data.achievement[id].order, 4, '0'),
            leftPad(100000 - id, 6, '0')
        ].join('|'))
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .achievements {
        column-count: 1;
        gap: 1rem;
        width: 100%;

        @media screen and (min-width: 1600px) {
            align-items: flex-start;
            column-count: 2;
            //display: grid;
            //grid-template-columns: 1fr 1fr;
        }
    }
</style>

<div class="wrapper">
    <div class="options-container">
        <span>Show:</span>

        <button>
            <Checkbox
                name="show_completed"
                bind:value={$achievementState.showCompleted}
            >Completed</Checkbox>
        </button>

        <button>
            <Checkbox
                name="show_incomplete"
                bind:value={$achievementState.showIncomplete}
            >Incomplete</Checkbox>
        </button>
    </div>

    {#if category && achievementIds}
        <div class="achievements">
            {#each achievementIds as achievementId (achievementId)}
                <AchievementsAchievement {achievementId} />
            {/each}
        </div>
    {/if}
</div>
