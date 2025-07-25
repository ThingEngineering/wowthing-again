<script lang="ts">
    import { iconStrings } from '@/data/icons';
    import { iconLibrary } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { WarbankItem } from '@/types/items';
    import { getItemUrl } from '@/utils/get-item-url';
    import type { LazyConvertibleCharacterItem } from '@/user-home/state/lazy/convertible.svelte';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { data }: { data: LazyConvertibleCharacterItem[] } = $props();
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0.5rem;
        // padding: 0.4rem 0 0 0;
        width: 100%;
    }
    .upgradeable-item {
        display: flex;
        align-items: center;
        justify-content: space-around;

        &:first-child {
            padding-top: 0.5rem;
        }
    }
    a {
        height: 44px;
        position: relative;
        width: 44px;
    }
    .sadness {
        color: #aaa;
    }
    .icon-info {
        background-color: $highlight-background;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-small);
        font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    .warbank {
        top: -4px;
    }
    .item-level {
        bottom: 4px;
        //color: #ffffff;
    }
    .icons-left,
    .icons-right {
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
    {#each data as slotData (slotData)}
        <div class="upgradeable-item">
            <span class="icons-left status-shrug drop-shadow">
                {#if slotData.isPurchased}
                    <IconifyIcon
                        extraClass={slotData.canAfford ? 'status-shrug' : 'status-fail'}
                        icon={iconLibrary.mdiCurrencyUsd}
                        scale="0.85"
                        tooltip="Purchase this item!"
                    />
                {/if}

                {#if slotData.isUpgradeable}
                    <IconifyIcon
                        extraClass={slotData.canUpgrade ? 'status-shrug' : 'status-fail'}
                        icon={iconStrings.plus}
                        tooltip={slotData.canUpgrade
                            ? 'Upgrade this item!'
                            : 'Upgrade this item when you can afford to!'}
                    />
                {/if}
            </span>

            <a
                class="quality{slotData.equippedItem.quality}"
                href={slotData.equippedItem.itemId > 10_000
                    ? getItemUrl(slotData.equippedItem)
                    : `https://${settingsState.wowheadBaseUrl}/currency=${slotData.equippedItem.itemId}`}
            >
                <WowthingImage
                    name={slotData.equippedItem.itemId > 10_000
                        ? `item/${slotData.equippedItem.itemId}`
                        : `currency/${slotData.equippedItem.itemId}`}
                    size={40}
                    border={2}
                />

                {#if slotData.equippedItem instanceof WarbankItem}
                    <span class="icon-info warbank">WB</span>
                {/if}

                <span class="icon-info item-level">{slotData.equippedItem.itemLevel}</span>
            </a>

            <span class="icons-right status-shrug drop-shadow">
                {#if slotData.isConvertible}
                    <IconifyIcon
                        extraClass={slotData.canConvert ? 'status-shrug' : 'status-fail'}
                        icon={iconLibrary.gameShurikenAperture}
                        scale="0.85"
                        tooltip={slotData.canConvert
                            ? 'Convert this item at the Catalyst!'
                            : 'Convert this item at the Catalyst when you have a charge!'}
                    />
                {/if}
            </span>
        </div>
    {:else}
        <span class="sadness">---</span>
    {/each}
</div>
