<script lang="ts">
    import find from 'lodash/find';
    import sortBy from 'lodash/sortBy';
    import { replace } from 'svelte-spa-router';

    import { achievementStore } from '@/stores';
    import { achievementState } from '@/stores/local-storage';
    import { leftPad } from '@/utils/formatting';
    import type { AchievementDataCategory } from '@/types';

    import Achievement from './Achievement.svelte';
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import { userState } from '@/user-home/state/user';

    export let slug1: string;
    export let slug2: string;

    let achievementIds: (number | number[])[];
    let category: AchievementDataCategory;
    $: {
        category = find($achievementStore.categories, (c) => c !== null && c.slug === slug1);
        if (!category) {
            break $;
        }

        if (slug2) {
            category = find(category.children, (c) => c !== null && c.slug === slug2);
            if (!category) {
                break $;
            }
        } else if (category.achievementIds.length === 0 && category.children.length > 0) {
            replace(`/achievements/${slug1}/${category.children[0].slug}`);
        }

        achievementIds =
            category.id >= 200000
                ? category.achievementIds
                : sortBy(category.achievementIds as number[], (id) =>
                      [
                          userState.achievements.achievementEarnedById.has(id) ? '0' : '1',
                          leftPad($achievementStore.achievement[id].categoryId, 5, '0'),
                          leftPad($achievementStore.achievement[id].order, 4, '0'),
                          leftPad(100000 - id, 6, '0'),
                      ].join('|')
                  ).filter((id) => {
                      const cheev = $achievementStore.achievement[id as number];

                      // Don't show tracking achievements
                      if ((cheev.flags & 0x100_000) > 0) {
                          return false;
                      }

                      // Obey faction filters
                      return (
                          cheev.faction === -1 ||
                          (cheev.faction === 1 && $achievementState.showAlliance) ||
                          (cheev.faction === 0 && $achievementState.showHorde)
                      );
                  });
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
    .new-group {
        margin-left: 1rem;
    }
    .faction0 {
        border-color: $alliance-border;
    }
    .faction1 {
        border-color: $horde-border;
    }
    .progress-bar {
        width: 15rem;
    }
</style>

<div class="wrapper">
    <div class="options-container">
        <span>Show:</span>

        <button>
            <Checkbox name="show_completed" bind:value={$achievementState.showCompleted}
                >Completed</Checkbox
            >
        </button>

        <button>
            <Checkbox name="show_incomplete" bind:value={$achievementState.showIncomplete}
                >Incomplete</Checkbox
            >
        </button>

        <button class="faction0 new-group">
            <Checkbox name="show_alliance" bind:value={$achievementState.showAlliance}
                >Alliance</Checkbox
            >
        </button>

        <button class="faction1">
            <Checkbox name="show_horde" bind:value={$achievementState.showHorde}>Horde</Checkbox>
        </button>

        <button class="new-group">
            <Checkbox name="show_all_characters" bind:value={$achievementState.showAllCharacters}
                >All character progress</Checkbox
            >
        </button>

        {#if category && userState.achievements.categories[category.id].totalPoints}
            <div class="progress-bar new-group">
                <ProgressBar
                    title="Points"
                    have={userState.achievements.categories[category.id].havePoints}
                    total={userState.achievements.categories[category.id].totalPoints}
                />
            </div>
        {/if}
    </div>

    {#if category && achievementIds}
        <div class="achievements">
            {#each achievementIds as achievementId (achievementId)}
                {#if Array.isArray(achievementId)}
                    {#each achievementId as subAchievementId (subAchievementId)}
                        <Achievement
                            kindaAlwaysShow={category.id >= 200000}
                            achievementId={subAchievementId}
                            allAchievementIds={achievementId}
                        />
                    {/each}
                {:else}
                    <Achievement kindaAlwaysShow={category.id >= 200000} {achievementId} />
                {/if}
            {/each}
        </div>
    {/if}
</div>
