<script lang="ts">
    import { Faction } from '@/enums/faction';
    import { RewardType } from '@/enums/reward-type';
    import { iconLibrary } from '@/shared/icons';
    import { timeState } from '@/shared/state/time.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { QuestInfoFlags, QuestInfoType } from '@/shared/stores/static/enums';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { toNiceNumber } from '@/utils/formatting/to-nice-number';

    import { questInfoIcon } from './data';
    import type { ApiWorldQuest } from './types';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Tooltip from './Tooltip.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { worldQuest }: { worldQuest: ApiWorldQuest } = $props();

    let staticWorldQuest = $derived(wowthingData.static.worldQuestById.get(worldQuest.questId));
    let questInfo = $derived(wowthingData.static.questInfoById.get(staticWorldQuest?.questInfoId));

    let hoursRemaining = $derived(
        worldQuest.expires.diff(timeState.slowTime).toMillis() / 1000 / 60 / 60
    );
    let strokeColor = $derived.by(() => {
        if (hoursRemaining < 6) {
            return 'var(--color-fail)';
        } else if (hoursRemaining < 12) {
            return 'var(--color-warn)';
        } else if (hoursRemaining < 24) {
            return 'var(--color-shrug)';
        } else {
            return 'var(--color-success)';
        }
    });

    let [iconName, rewardString] = $derived.by(() => {
        let retIcon: string = undefined;
        let retReward: string = undefined;

        const firstReward = worldQuest.rewards[0][1][0];
        if (firstReward.type === RewardType.Item) {
            retIcon = `item/${firstReward.id}`;
            if (firstReward.amount > 1) {
                retReward = toNiceNumber(firstReward.amount);
            }
        } else if (firstReward.type === RewardType.Currency) {
            retIcon = `currency/${firstReward.id}`;
            if (firstReward.id === 0) {
                retReward = toNiceNumber(Math.floor(firstReward.amount / 10000));
            } else {
                retReward = toNiceNumber(firstReward.amount);
            }
        }

        return [retIcon, retReward];
    });
</script>

<style lang="scss">
    .world-quest {
        --color-link: var(--color-body-text);

        display: flex;
        flex-direction: column;
        gap: 0;
        left: var(--left);
        position: absolute;
        top: var(--top);
        transform: translateX(-50%) translateY(-18px);
        width: 50px;

        &:hover {
            z-index: 100;
        }
        :global(a) {
            overflow: auto;
        }
    }
    .world-quest-icon {
        --image-border-width: 0;

        background: var(--color-highlight-background);
        border-radius: 50%;
        height: 50px;
        position: relative;
        width: 50px;

        :global(img) {
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
    .world-quest-faction {
        --image-border-radius: 50%;
        --scale: 0.8;

        pointer-events: none;
        top: 5px;
        position: absolute;
        left: -8px;
    }
    .world-quest-type {
        --scale: 0.8;

        top: 5px;
        position: absolute;
        right: -8px;
    }
    .world-quest-amount {
        background: var(--color-highlight-background);
        border: 2px solid var(--image-border-color, var(--border-color));
        border-radius: var(--border-radius-small);
        font-size: 95%;
        line-height: 1;
        margin-top: -3px;
        padding: 0 2px 2px 2px;
        text-align: center;
    }
</style>

{#if worldQuest.expires > timeState.slowTime}
    <div
        class="world-quest"
        class:status-success={hoursRemaining >= 12}
        class:status-shrug={hoursRemaining < 12 && hoursRemaining >= 6}
        class:status-fail={hoursRemaining < 6}
        data-id={worldQuest.questId}
        style="--left: {worldQuest.locationX}%; --top: {worldQuest.locationY}%;"
        style:--stroke={strokeColor}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                worldQuest,
            },
            tippyProps: {
                allowHTML: true,
                placement: 'right-start',
            },
        }}
    >
        <WowheadLink id={worldQuest.questId} type="quest" toComments={true}>
            <div class="world-quest-icon">
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    style="transform:rotate(-90deg)"
                >
                    <circle
                        r="20"
                        cx="25"
                        cy="25"
                        fill="transparent"
                        stroke="#101418"
                        stroke-width="6"
                    ></circle>
                    <circle
                        r="21"
                        cx="25"
                        cy="25"
                        stroke="var(--stroke)"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-dashoffset="{130 - (Math.min(48, hoursRemaining) / 48) * 130}px"
                        fill="transparent"
                        stroke-dasharray="130px"
                    ></circle>
                </svg>

                {#if iconName}
                    <WowthingImage name={iconName} size={32} border={0} />
                {:else}
                    WQ
                {/if}
            </div>

            {#if staticWorldQuest && staticWorldQuest.faction !== Faction.Neutral}
                <div class="world-quest-faction">
                    <FactionIcon faction={staticWorldQuest.faction} />
                </div>
            {/if}

            {#if questInfoIcon[questInfo?.type]}
                <div class="world-quest-type drop-shadow">
                    <IconifyIcon icon={iconLibrary[questInfoIcon[questInfo.type]]} />
                </div>
            {:else if questInfo?.type === QuestInfoType.Normal || questInfo?.type === QuestInfoType.WorldBoss}
                {#if (questInfo.flags & QuestInfoFlags.Elite) > 0}
                    <div class="world-quest-type drop-shadow">
                        <IconifyIcon icon={iconLibrary['gameCrownedSkull']} />
                    </div>
                {/if}
            {/if}

            {#if rewardString}
                <div class="world-quest-amount">
                    {rewardString}
                </div>
            {/if}
        </WowheadLink>
    </div>
{/if}
