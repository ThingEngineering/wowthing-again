<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { iconLibrary } from '@/shared/icons'
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
    .convertible, .upgradeable {
        line-height: 1;
        width: 24px;
    }
    .convertible {
        left: -25px;
    }
    .upgradeable {
        right: -25px;
    }
</style>

<div class="wrapper-column">
    {#each data as { equippedItem, isConvertible, isUpgradeable }}
        <div class="upgradeable-item">
            <span class="upgradeable status-shrug drop-shadow">
                {#if isUpgradeable}
                    <IconifyIcon
                        icon={iconStrings.plus}
                        tooltip={'Upgrade this item!'}
                    />
                {/if}
            </span>

            <a
                class="quality{equippedItem.quality}"
                href={getItemUrl(equippedItem)}
            >
                <WowthingImage
                    name="item/{equippedItem.itemId}"
                    size={40}
                    border={2}
                />
                
                <span class="item-level">{equippedItem.itemLevel}</span>
            </a>

            <span class="convertible status-shrug drop-shadow">
                {#if isConvertible}
                    <IconifyIcon
                        icon={iconLibrary.gameShurikenAperture}
                        scale={'0.9'}
                        tooltip={'Convert this item at the Catalyst!'}
                    />
                {/if}
            </span>
        </div>
    {:else}
        <span class="sadness">---</span>
    {/each}
</div>
