<script lang="ts">
    import { achievementStore, userStore } from '@/stores'
    import type { AchievementDataAchievement } from '@/types'

    import AchievementLink from '@/components/links/AchievementLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let achievementId: number

    let achievement: AchievementDataAchievement
    let earned: number
    let earnedDate: Date
    let show = true
    let supersedes: number[]
    $: {
        achievement = $achievementStore.data.achievements[achievementId]
        earned = $userStore.data.achievements[achievementId]
        earnedDate = new Date(earned * 1000)
        supersedes = []

        if (achievement.supersededBy) {
            console.log(achievement.id, achievement.supersededBy, $userStore.data.achievements[achievement.supersededBy])
        }

        if (achievement.supersededBy && (
            $userStore.data.achievements[achievement.supersededBy] ||
            $userStore.data.achievements[$achievementStore.data.achievements[achievement.supersededBy].supersededBy]
        )) {
            show = false
        }
        else if (earned && achievement.supersedes) {
            let sigh = achievement
            while (sigh?.supersedes) {
                supersedes.push(sigh.supersedes)
                sigh = $achievementStore.data.achievements[sigh.supersedes]
            }
            supersedes.reverse()
            console.log(supersedes)
        }
    }
</script>

<style lang="scss">
    .thing-container {
        --icon-border-width: 1px;

        border: 1px solid $border-color;
        display: grid;
        grid-template-areas:
            "icon     info"
            ".        super"
            "criteria criteria";
        grid-template-columns: calc(50px + 0.5rem) auto;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        width: 100%;

        &.completed {
            background: mix($thing-background, $colour-success, 90%);
            border-color: mix($border-color, $colour-success, 90%);
        }

        &.faction-1 {
            --icon-border-color: #{$neutral-border};
        }
    }
    .info {
        display: grid;
        grid-area: info;
        grid-template-areas:
            "name points"
            "desc earned";
        grid-template-columns: auto 5.5rem;
        grid-template-rows: 1.5rem auto;
    }
    h3 {
        grid-area: name;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .points {
        grid-area: points;
        line-height: 1;
        text-align: right;
    }
    .earned {
        grid-area: earned;
        text-align: right;
    }
    .description {
        grid-area: desc;
        margin: 0;
    }
    .supersedes {
        grid-area: super;
        margin-top: 0.5rem;

        div {
            display: inline-block;
            margin: 0 0.4rem 0.4rem 0;
            position: relative;

            span {
                bottom: 1px;
                left: 50%;
                pointer-events: none;
                position: absolute;
                transform: translateX(-50%);

                background: rgba(0, 0, 0, 0.7);
                border-radius: $border-radius-small;
                line-height: 1;
                padding: 0 2px 1px 1px;
                white-space: nowrap;
            }
        }
    }
</style>

{#if show}
    <div class="thing-container faction{achievement.faction}" class:completed={earned}>
        <WowthingImage name="achievement/{achievementId}" size={48} border={1} />

        <div class="info">
            <h3>{achievement.name}</h3>

            <p class="description">{achievement.description}</p>

            {#if achievement.points > 0}
                <span class="points">{achievement.points} points</span>
            {/if}

            {#if earned}
                <span class="earned">{earnedDate.toLocaleDateString()}</span>
            {/if}
        </div>

        {#if supersedes.length > 0}
            <div class="supersedes">
                {#each supersedes as previousId}
                    <div>
                        <AchievementLink id={previousId}>
                            <WowthingImage name="achievement/{previousId}" size={40} border={1} />
                        </AchievementLink>
                        {#if $achievementStore.data.achievements[previousId]}
                            <span>{$achievementStore.data.achievements[previousId].points}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}
