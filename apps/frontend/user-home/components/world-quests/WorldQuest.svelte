<script lang="ts">
    import { RewardType } from '@/enums/reward-type'
    import { timeStore } from '@/stores/time'
    import type { ApiWorldQuest } from './types/api-world-quest'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'
    import { toNiceNumber } from '@/utils/formatting/to-nice-number';

    export let worldQuest: ApiWorldQuest

    let iconName: string
    let rewardString: string
    $: {
        iconName = undefined
        rewardString = undefined

        const firstReward = worldQuest.rewards[0][1][0]
        if (firstReward.type === RewardType.Item) {
            iconName = `item/${firstReward.id}`
        }
        else if (firstReward.type === RewardType.Currency) {
            iconName = `currency/${firstReward.id}`
            if (firstReward.id === 0) {
                rewardString = toNiceNumber(Math.floor(firstReward.amount / 10000))
            }
            else {
                rewardString = toNiceNumber(firstReward.amount)
            }
        }
    }

    $: hoursRemaining = worldQuest.expires.diff($timeStore).toMillis() / 1000 / 60 / 60
</script>

<style lang="scss">
    .world-quest, .reward-amount {
        background: $highlight-background;
        border: 2px solid #aaa;
        position: absolute;
        transform: translateX(-50%) translateY(-50%);
    }
    .world-quest {
        --image-border-width: 0;

        border-radius: 50%;
        height: 36px;
        left: var(--left);
        overflow: hidden;
        top: var(--top);
        transform: translateX(-50%) translateY(-50%);
        width: 36px;
    }
    .reward-amount {
        border: 2px solid #aaa;
        border-radius: $border-radius-small;
        font-size: 95%;
        left: var(--left);
        line-height: 1;
        padding: 0 2px 2px 2px;
        top: calc(var(--top) + 25px);
        z-index: 1;
    }
</style>

{#if worldQuest.expires > $timeStore}
    <div
        class="world-quest"
        class:border-success={hoursRemaining >= 24}
        class:border-shrug={hoursRemaining < 24 && hoursRemaining >= 12}
        class:border-fail={hoursRemaining < 12}
        style="--left: {worldQuest.locationX}%; --top: {worldQuest.locationY}%;"
    >
        {#if iconName}
            <WowthingImage
                name={iconName}
                size={32}
                border={0}
            />
        {:else}
            WQ
        {/if}
    </div>

    {#if rewardString}
        <div
            class="reward-amount"
            style="--left: {worldQuest.locationX}%; --top: {worldQuest.locationY}%;"
        >
            {rewardString}
        </div>
    {/if}
{/if}
