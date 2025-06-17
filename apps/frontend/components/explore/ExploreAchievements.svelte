<script lang="ts">
    import { onMount } from 'svelte';

    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { achievementStore } from '@/stores';
    import type { AchievementDataAchievement } from '@/types';

    import CriteriaTree from './ExploreAchievementsCriteriaTree.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let achievement: AchievementDataAchievement;

    // Fetch achievement data once when this component is mounted
    onMount(
        async () =>
            await Promise.all([
                achievementStore.fetch({ language: settingsState.value.general.language }),
                //userAchievementStore.fetch(),
            ])
    );

    let ready: boolean;
    $: {
        ready = false;
        if (!$achievementStore.error && $achievementStore.loaded) {
            ready = true;
        }
    }

    $: {
        if (ready) {
            achievement = $achievementStore.achievement[browserState.current.explore.achievementId];
        }
    }
</script>

<style lang="scss">
    .thing-container {
        padding: 1rem;
        width: 100%;

        :global(input) {
            width: 10rem;
        }
    }
    .info {
        --image-border-width: 2px;
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    p {
        margin-top: 0.5rem;
    }
    .criteria {
        border-top: 1px dashed $border-color;
        margin-top: 0.5rem;
    }
</style>

<div class="thing-container border">
    <NumberInput
        name="achievement_id"
        minValue={0}
        maxValue={999999}
        bind:value={browserState.current.explore.achievementId}
    />

    {#if achievement}
        <div class="info">
            <div>
                <WowthingImage
                    name="achievement/{browserState.current.explore.achievementId}"
                    size={48}
                    border={2}
                />
            </div>

            <div>
                <h3>
                    {#if achievement.faction >= 0}
                        <FactionIcon
                            faction={achievement.faction === 0 ? 1 : 0}
                            border={2}
                            size={20}
                        />
                    {/if}
                    <code>[{achievement.id}]</code>
                    {achievement.name}
                </h3>
                <p>{achievement.description}</p>
            </div>
        </div>

        {#if achievement.reward}
            <div>
                {achievement.reward}
            </div>
        {/if}

        <div class="criteria">
            <CriteriaTree {achievement} criteriaTreeId={achievement.criteriaTreeId} />
        </div>
    {/if}
</div>
