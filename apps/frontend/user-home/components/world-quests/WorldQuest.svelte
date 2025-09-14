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

    let hoursRemaining = $derived(
        worldQuest.expires.diff(timeState.slowTime).toMillis() / 1000 / 60 / 60
    );
    let staticWorldQuest = $derived(wowthingData.static.worldQuestById.get(worldQuest.questId));
    let questInfo = $derived(wowthingData.static.questInfoById.get(staticWorldQuest?.questInfoId));

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
        width: 36px;

        &:hover {
            z-index: 100;
        }
    }
    .world-quest-icon,
    .world-quest-amount {
        background: var(--color-highlight-background);
        border: 2px solid var(--image-border-color, var(--border-color));
    }
    .world-quest-icon {
        --image-border-width: 0;

        border-radius: 50%;
        height: 36px;
        overflow: hidden;
        position: relative;
        width: 36px;
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
        class="world-quest drop-shadow"
        class:border-success={hoursRemaining >= 12}
        class:border-shrug={hoursRemaining < 12 && hoursRemaining >= 6}
        class:border-fail={hoursRemaining < 6}
        data-id={worldQuest.questId}
        style="--left: {worldQuest.locationX}%; --top: {worldQuest.locationY}%;"
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
