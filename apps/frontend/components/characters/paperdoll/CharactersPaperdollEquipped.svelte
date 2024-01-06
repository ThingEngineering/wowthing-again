<script lang="ts">
    import { InventorySlot  } from '@/enums/inventory-slot'
    import { staticStore } from '@/shared/stores/static'
    import { itemStore } from '@/stores'
    import { getEnchantmentText } from '@/utils/get-enchantment-text'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character } from '@/types'

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let inventorySlot: InventorySlot
    export let leftSide = false

    $: equippedItem = character.equippedItems[inventorySlot]
    $: item = $itemStore.items[equippedItem?.itemId]

    $: embellishments = (equippedItem?.bonusIds || [])
        .map((bonusId) => $itemStore.bonusIdToModifiedCrafting[bonusId])
        .filter((emb) => emb !== undefined)

    const getCraftedData = () => {
        // Dream Crafted
        if (equippedItem.bonusIds.indexOf(9498) >= 0) {
            if (equippedItem.bonusIds.indexOf(9405) >= 0) {
                return [5, 5]
            }
            else if (equippedItem.bonusIds.indexOf(9404) >= 0) {
                return [4, 5]
            }
            else if (equippedItem.bonusIds.indexOf(9403) >= 0) {
                return [3, 5]
            }
            else if (equippedItem.bonusIds.indexOf(9402) >= 0) {
                return [2, 5]
            }
            else {
                return [1, 5]
            }
        }
        return [0, 0]
    }
    const getUpgradeData = () => {
        for (const bonusId of equippedItem.bonusIds) {
            const upgrades = $itemStore.itemBonusToUpgrade[bonusId]
            if (upgrades) {
                return upgrades
            }
        }
    }
</script>

<style lang="scss">
    .item {
        align-items: flex-end;
        display: flex;
        gap: 0.3rem;
    }
    .item-icon {
        --image-border-width: 2px;
        --shadow-color: rgba(0, 0, 0, 0.9);

        height: calc(56px + (2 * var(--image-border-width)));
        width: calc(56px + (2 * var(--image-border-width)));

        a {
            display: block;
            position: relative;
        }
        .empty-slot {
            background: rgba(0, 0, 0, 0.2);
            border-width: var(--image-border-width);
            height: 100%;
            width: 100%;
        }
        .upgrade-level {
            // --image-margin-top: 2px !important;

            font-size: 90%;
            top: 2px;
            word-spacing: -0.2ch;
        }
        .item-level {
            bottom: 2px;
        }    
    }
    .item-text {
        display: flex;
        flex-direction: column;
        // gap: 3px;
        height: 60px;
        justify-content: center;
        padding-right: 0.1rem;

        span {
            background-color: rgba(0, 0, 0, 0.75);
            padding: 0 3px 1px 3px;
        }
    }
    .embellishment, .enchant {
        font-size: 90%;
    }
</style>

<div
    class="item"
    style:flex-direction={leftSide ? 'row-reverse' : 'row'}
>
    <div
        class="item-icon"
        class:drop-shadow={equippedItem}
    >
        {#if equippedItem}
            {@const [craftedCurrent, craftedMax] = getCraftedData()}
            {@const upgradeData = getUpgradeData()}
            <a
                class="quality{equippedItem.quality}"
                href={getItemUrl(equippedItem)}
            >
                <WowthingImage
                    name="item/{equippedItem.itemId}"
                    size={56}
                    border={2}
                />
                <span class="item-level pill abs-center">{equippedItem.itemLevel}</span>

                {#if upgradeData?.[0] > 0}
                    {@const upgradeString = $staticStore.sharedStrings[upgradeData[0]]}
                    {@const percent = upgradeData[1] / upgradeData[2] * 100}
                    <span
                        class="upgrade-level pill abs-center"
                        class:status-fail={percent === 0}
                        class:status-shrug={percent > 0 && percent < 100}
                        class:status-success={percent === 100}
                    >
                        {upgradeString.charAt(0)} {upgradeData[1]} / {upgradeData[2]}
                    </span>
                {:else if craftedMax > 0}
                    <span
                        class="upgrade-level pill abs-center"
                    >
                        <CraftedQualityIcon quality={craftedCurrent} />
                    </span>
                {/if}
            </a>
        {:else}
            <div class="empty-slot border"></div>
        {/if}
    </div>

    {#if equippedItem}
        <div
            class="item-text"
            style:align-items={leftSide ? 'flex-end' : 'flex-start'}
        >
            <span class="quality{equippedItem.quality}">{item.name}</span>
            
            {#each embellishments as embellishment}
                <span
                    class="embellishment quality8"
                    data-id={embellishment.itemId}
                >
                    <WowheadLink
                        id={embellishment.itemId}
                        type="item"
                    >
                        {embellishment.displayName}
                    </WowheadLink>
                </span>
            {/each}

            {#if equippedItem.enchantmentIds?.length > 0}
                {@const enchantId = equippedItem.enchantmentIds[0]}
                <span class="enchant">
                    <ParsedText
                        cls="quality2"
                        text={getEnchantmentText(enchantId, $staticStore.enchantments[enchantId])}
                    />
                </span>
            {/if}
        </div>
    {/if}
</div>
