<script lang="ts">
    import find from 'lodash/find';
    import sortBy from 'lodash/sortBy';
    import uniq from 'lodash/uniq';
    import { replace } from 'svelte-spa-router';

    import { achievementState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import { leftPad } from '@/utils/formatting';

    import Achievement from './Achievement.svelte';
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import { wowthingData } from '@/shared/stores/data';

    type Props = {
        everythingSort?: boolean;
        hideOptions?: boolean;
        overrideShowCollected?: boolean;
        overrideShowUncollected?: boolean;
        recursive?: boolean;
        slug1: string;
        slug2: string;
    };
    let {
        everythingSort,
        hideOptions,
        overrideShowCollected,
        overrideShowUncollected,
        recursive,
        slug1,
        slug2,
    }: Props = $props();

    let category = $derived.by(() => {
        let cat = find(wowthingData.achievements.categories, (c) => c !== null && c.slug === slug1);
        if (!cat) {
            return null;
        }

        if (slug2 && slug2 !== 'day-of-the-dead') {
            cat = find(cat.children, (c) => c !== null && c.slug === slug2);
        } else if (cat.achievementIds.length === 0 && cat.children.length > 0) {
            replace(`/achievements/${slug1}/${cat.children[0].slug}`);
        }

        return cat;
    });

    let achievementIds = $derived.by(() => {
        if (!category) {
            return [];
        }

        if (category.id >= 200000) {
            return category.achievementIds;
        }

        if (slug2 === 'day-of-the-dead') {
            return [3456, 9426, 9427, 9428];
        }

        let ids = category.achievementIds as number[];

        if (recursive) {
            for (const child of category.children) {
                ids.push(...(child.achievementIds as number[]));
            }
        }

        if (everythingSort) {
            ids = sortBy(ids, (id) =>
                [
                    userState.achievements.achievementEarnedById.has(id) ? '1' : '0',
                    leftPad(
                        2_100_000_000 - (userState.achievements.achievementEarnedById.get(id) || 0),
                        10,
                        '0'
                    ),
                    leftPad(wowthingData.achievements.achievementById.get(id).categoryId, 5, '0'),
                    leftPad(wowthingData.achievements.achievementById.get(id).order, 4, '0'),
                ].join('|')
            );
        } else {
            ids = sortBy(category.achievementIds as number[], (id) =>
                [
                    userState.achievements.achievementEarnedById.has(id) ? '0' : '1',
                    leftPad(wowthingData.achievements.achievementById.get(id).categoryId, 5, '0'),
                    leftPad(wowthingData.achievements.achievementById.get(id).order, 4, '0'),
                    leftPad(100000 - id, 6, '0'),
                ].join('|')
            );
        }

        return uniq(
            ids.filter((id) => {
                const cheev = wowthingData.achievements.achievementById.get(id);

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
            })
        );
    });
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .achievements {
        column-count: 1;
        gap: 1rem;
        width: 100%;

        @media screen and (min-width: 1400px) {
            align-items: flex-start;
            column-count: 2;
            //display: grid;
            //grid-template-columns: 1fr 1fr;
        }
    }
    .new-group {
        margin-left: 1rem;
    }
    .faction0,
    .faction1 {
        border-color: var(--image-border-color);
    }
    .progress-bar {
        width: 15rem;
    }
</style>

<div class="wrapper">
    {#if !hideOptions}
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
                <Checkbox name="show_horde" bind:value={$achievementState.showHorde}>Horde</Checkbox
                >
            </button>

            <button class="new-group">
                <Checkbox
                    name="show_all_characters"
                    bind:value={$achievementState.showAllCharacters}
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
    {/if}

    {#if category && achievementIds}
        <div class="achievements">
            {#each achievementIds as achievementId (achievementId)}
                {#if Array.isArray(achievementId)}
                    {#each achievementId as subAchievementId (subAchievementId)}
                        <Achievement
                            kindaAlwaysShow={category.id >= 200000}
                            achievementId={subAchievementId}
                            allAchievementIds={achievementId}
                            {overrideShowCollected}
                            {overrideShowUncollected}
                        />
                    {/each}
                {:else}
                    <Achievement
                        kindaAlwaysShow={category.id >= 200000}
                        {achievementId}
                        {overrideShowCollected}
                        {overrideShowUncollected}
                    />
                {/if}
            {/each}
        </div>
    {/if}
</div>
