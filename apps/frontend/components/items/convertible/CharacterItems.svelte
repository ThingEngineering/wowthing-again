<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { iconLibrary } from '@/shared/icons'
    import { settingsStore } from '@/shared/stores/settings/store'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { LazyConvertibleCharacterItem } from '@/stores/lazy/convertible'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let data: LazyConvertibleCharacterItem[]
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0.5rem;
        padding: 0.4rem 0 0 0;
        width: 100%;
    }
    .upgradeable-item {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    a {
        height: 44px;
        position: relative;
        width: 44px;
    }
    .sadness {
        color: #aaa;
    }
    .item-level {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        bottom: 4px;
        //color: #ffffff;
        font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    .icons-left, .icons-right {
        display: flex;
        flex-direction: column;
        line-height: 1;
        width: 24px;
    }
    .icons-left {
        left: -25px;
    }
    .icons-right {
        right: -25px;
    }
</style>

<div class="wrapper-column">
    {#each data as slotData}
        <div class="upgradeable-item">
            <span class="icons-left status-shrug drop-shadow">
                {#if slotData.isPurchased}
                    <IconifyIcon
                        extraClass={slotData.canAfford ? 'status-success' : 'status-fail'}
                        icon={iconLibrary.mdiCurrencyUsd}
                        scale={'0.85'}
                        tooltip={'Purchase this item!'}
                    />
                {/if}

                {#if slotData.isUpgradeable}
                    <IconifyIcon
                        extraClass={slotData.canUpgrade ? 'status-success' : 'status-fail'}
                        icon={iconStrings.plus}
                        tooltip={'Upgrade this item!'}
                    />
                {/if}
            </span>

            <a
                class="quality{slotData.equippedItem.quality}"
                href={slotData.equippedItem.itemId > 10_000
                    ? getItemUrl(slotData.equippedItem)
                    : `https://${settingsStore.wowheadBaseUrl}/currency=${slotData.equippedItem.itemId}`}
            >
                <WowthingImage
                    name={slotData.equippedItem.itemId > 10_000
                        ? `item/${slotData.equippedItem.itemId}`
                        : `currency/${slotData.equippedItem.itemId}`}
                    size={40}
                    border={2}
                />
                
                <span class="item-level">{slotData.equippedItem.itemLevel}</span>
            </a>

            <span class="icons-right status-shrug drop-shadow">
                {#if slotData.isConvertible}
                    <IconifyIcon
                        extraClass={slotData.canConvert ? 'status-success' : 'status-fail'}
                        icon={iconLibrary.gameShurikenAperture}
                        scale={'0.85'}
                        tooltip={'Convert this item at the Catalyst!'}
                    />
                {/if}
            </span>
        </div>
    {:else}
        <span class="sadness">---</span>
    {/each}
</div>
