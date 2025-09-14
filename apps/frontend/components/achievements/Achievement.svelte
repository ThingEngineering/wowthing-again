<script lang="ts">
    import { iconStrings } from '@/data/icons';
    import { achievementStore } from '@/stores';
    import { achievementState } from '@/stores/local-storage';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { AchievementDataAchievement } from '@/types';

    import AchievementLink from '@/shared/components/links/AchievementLink.svelte';
    import Criteria from './Criteria.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { userState } from '@/user-home/state/user';

    export let achievementId: number;
    export let allAchievementIds: number[] = undefined;
    export let alwaysShow = false;
    export let kindaAlwaysShow = false;

    let achievement: AchievementDataAchievement;
    let earned: number;
    let earnedDate: Date;
    let show: boolean;
    let chain: number[];
    let faction: number;
    $: {
        achievement = $achievementStore.achievement[achievementId];
        if (!achievement) {
            break $;
        }

        if (allAchievementIds) {
            for (const possibleId of allAchievementIds) {
                const possibleEarned = userState.achievements.achievementEarnedById.get(possibleId);
                if (possibleEarned && (!earned || possibleEarned < earned)) {
                    earned = possibleEarned;
                }
            }
        } else {
            earned = userState.achievements.achievementEarnedById.get(achievementId);
        }

        earnedDate = new Date(earned * 1000);
        chain = [];
        show = true;

        // Why are achievement factions reversed? Who knows :|
        if (achievement.faction === 0) {
            faction = 1;
        } else if (achievement.faction === 1) {
            faction = 0;
        } else {
            faction = achievement.faction;
        }

        // Chain : A B C D
        // Earned: A B
        // Check :
        //   A = earned + supersededBy earned, don't show
        //   B = earned + supersededBy not earned, show
        //   C = not earned + supersedes earned, show
        //   D = not earned + supersedes not earned, don't show

        // Hack for some weird achievements that don't reference future ones properly
        if (
            achievement.supersededBy &&
            (userState.achievements.achievementEarnedById.has(achievement.supersededBy) ||
                userState.achievements.achievementEarnedById.has(
                    $achievementStore.achievement[achievement.supersededBy].supersededBy
                ))
        ) {
            show = false;
        } else if (
            !kindaAlwaysShow &&
            achievement.supersedes &&
            !userState.achievements.achievementEarnedById.has(achievement.supersedes)
        ) {
            show = false;
        } else {
            let sigh = achievement;
            while (sigh?.supersedes) {
                chain.push(sigh.supersedes);
                sigh = $achievementStore.achievement[sigh.supersedes];
            }
            chain.reverse();

            if (chain.length > 0 || achievement.supersededBy) {
                chain.push(achievement.id);
            }

            if (achievement.supersededBy) {
                sigh = achievement;
                while (sigh?.supersededBy) {
                    chain.push(sigh.supersededBy);
                    sigh = $achievementStore.achievement[sigh.supersededBy];
                }
            }
        }

        if (alwaysShow) {
            show = true;
        } else {
            if (
                (earned && !$achievementState.showCompleted) ||
                (!earned && !$achievementState.showIncomplete)
            ) {
                show = false;
            } else if (!earned && $achievementStore.isHidden[achievementId]) {
                show = false;
            } else if (kindaAlwaysShow) {
                show = true;
            }
        }
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .thing-container {
        --image-border-width: 2px;

        border: 1px solid var(--border-color);
        break-inside: avoid;
        display: grid;
        grid-template-areas:
            'icon     info'
            '.        chain'
            'criteria criteria'
            'progress progress';
        grid-template-columns: calc(50px + 0.5rem) auto;
        margin-bottom: 0.5rem;
        overflow: hidden; /* Firefox fix */
        padding: 0.5rem;
        width: 100%;

        &.completed {
            :global(.status-fail) {
                --shadow-color: rgba(30, 30, 30, 0.5);
            }
        }

        &.faction-1 {
            --image-border-color: var(--color-neutral-border);
        }

        :global(a) {
            grid-area: icon;
            position: relative;
        }
    }

    .info {
        display: grid;
        grid-area: info;
        grid-template-areas:
            'name earned'
            'desc extra';
        grid-template-columns: auto 5.5rem;
        grid-template-rows: 1.5rem auto;
    }
    h3 {
        grid-area: name;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
    }
    .points {
        color: #fff;
        left: 25px;
        top: 32px;
    }
    .earned {
        grid-area: earned;
        text-align: right;
    }
    .extra {
        grid-area: extra;
        text-align: right;
    }
    .description {
        grid-area: desc;
        margin: 0;
    }
    .chain {
        grid-area: chain;
        margin-top: 0.5rem;
    }
    .chain-icon {
        display: inline-block;
        margin: 0 0.4rem 0.4rem 0;
        position: relative;

        &.completed {
            opacity: 0.5;

            :global(img) {
                filter: grayscale(75%);
            }
        }

        span {
            bottom: 1px;
            pointer-events: none;
        }
    }
    .chain-current {
        pointer-events: none;
        top: -2px;
    }
    .icon-faction {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        left: -3px;
        pointer-events: none;
        position: absolute;
        top: -3px;
    }
</style>

{#if achievement && show}
    <div
        class="thing-container faction{faction}"
        class:bg-success={earned}
        class:border-success={earned}
    >
        <AchievementLink id={achievementId}>
            <WowthingImage name="achievement/{achievementId}" size={48} border={2} />

            {#if achievement.points > 0}
                <span class="pill abs-center points">{achievement.points}</span>
            {/if}

            {#if faction >= 0}
                <div class="icon-faction drop-shadow">
                    <FactionIcon border={2} size={20} useTooltip={false} {faction} />
                </div>
            {/if}
        </AchievementLink>

        <div class="info">
            <h3>{achievement.name}</h3>

            <p class="description">{achievement.description}</p>

            {#if earned}
                <span class="earned">{earnedDate.toLocaleDateString()}</span>
            {/if}

            {#if achievement.isAccountWide}
                <span class="extra">Account</span>
            {/if}
        </div>

        {#if chain.length > 0}
            <div class="chain">
                {#each chain as chainId}
                    {@const chainEarned = userState.achievements.achievementEarnedById.has(chainId)}
                    <div class="chain-icon" class:completed={chainEarned}>
                        <AchievementLink id={chainId}>
                            <WowthingImage name="achievement/{chainId}" size={40} border={2} />
                        </AchievementLink>

                        {#if $achievementStore.achievement[chainId]}
                            <span class="pill abs-center">
                                {$achievementStore.achievement[chainId].points}
                            </span>
                        {/if}

                        {#if chainId === achievementId}
                            <div class="abs-center chain-current drop-shadow">
                                <IconifyIcon icon={iconStrings['arrow-up']} />
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}

        {#if !earned || settingsState.value.achievements.showCharactersIfCompleted}
            <Criteria {achievement} />
        {/if}
    </div>
{/if}
