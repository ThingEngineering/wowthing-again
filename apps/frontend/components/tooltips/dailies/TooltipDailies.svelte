<script lang="ts">
    import type { DateTime } from 'luxon'

    import { uiIcons } from '@/shared/icons'
    import { staticStore } from '@/shared/stores/static'
    import { itemStore, timeStore } from '@/stores'
    import { toNiceDuration } from '@/utils/formatting'
    import type { Character, DailyQuestsReward } from '@/types'
    import type { GlobalDailyQuest } from '@/types/data'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let callings: [DailyQuestsReward, GlobalDailyQuest, boolean][]
    export let character: Character
    export let expansion: number
    export let resets: DateTime[]

    let remaining: string[]
    $: {
        remaining = resets.map((reset) => toNiceDuration(reset.diff($timeStore).toMillis()))
    }
</script>

<style lang="scss">
    .status {
        padding-right: 0;
        width: 2rem;
    }
    .name {
        text-align: left;
    }
    .remaining {
        text-align: right;
    }
    .description {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        max-width: 20rem;
        text-align: left;

        p {
            margin-top: 0;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>
        {#if expansion === 8}
            Shadowlands Callings
        {:else if expansion === 7}
            Battle for Azeroth Emissaries
        {:else}
            Legion Emissaries
        {/if}
    </h5>
    
    <table class="table-striped">
        <tbody>
            {#each callings as [rewards, daily, status], callingIndex}
                <tr>
                    <td class="status">
                        <IconifyIcon
                            extraClass="{status ? 'status-success' : 'status-fail'}"
                            icon={status ? uiIcons.yes : uiIcons.no}
                            scale="0.91"
                        />
                    </td>
                    {#if daily}
                        <td class="name quality{daily.quality}">{daily.getName(character.faction)}</td>
                    {:else}
                        <td class="name">Unknown quest</td>
                    {/if}
                    <td class="remaining">
                        <code>{@html remaining[callingIndex]}</code>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td class="description" colspan="2">
                        <p>{daily?.description ?? '???'}</p>
                        {#if rewards}
                            {#if rewards.money > 0}
                                {Math.floor(rewards.money / 10000).toLocaleString()} g
                            {:else if rewards.itemId > 0}
                                <WowthingImage
                                    name="item/{rewards.itemId}"
                                    size={20}
                                    border={1}
                                />

                                {@const itemName = $itemStore.items[rewards.itemId]?.name}
                                <span class="quality{rewards.quality}">{itemName || `Item ${rewards.itemId}`}</span>

                                {#if rewards.quantity > 1}
                                    x {rewards.quantity}
                                {/if}

                            {:else if rewards.currencyId > 0}
                                {@const currency = $staticStore.currencies[rewards.currencyId]}

                                <WowthingImage
                                    name="currency/{rewards.currencyId}"
                                    size={20}
                                    border={1}
                                />
                                
                                <span class="quality3">
                                    {currency !== undefined ? currency.name : `Currency #${rewards.currencyId}`}
                                </span>

                                x {rewards.quantity.toLocaleString()}
                            {/if}
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
