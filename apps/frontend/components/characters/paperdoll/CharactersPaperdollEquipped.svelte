<script lang="ts">
    import { craftedTiers } from '@/data/crafted-gear';
    import { InventorySlot } from '@/enums/inventory-slot';
    import { staticStore } from '@/shared/stores/static';
    import { wowthingData } from '@/shared/stores/data';
    import { getEnchantmentText } from '@/utils/get-enchantment-text';
    import { getItemUrl } from '@/utils/get-item-url';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { Character } from '@/types';

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let character: Character;
    export let inventorySlot: InventorySlot;
    export let leftSide = false;

    $: equippedItem = character.equippedItems[inventorySlot];
    $: item = wowthingData.items.items[equippedItem?.itemId];

    $: embellishments = (equippedItem?.bonusIds || [])
        .map((bonusId) => wowthingData.items.bonusIdToModifiedCrafting[bonusId])
        .filter((emb) => emb !== undefined);

    const getCraftedData = () => {
        for (const [craftedBonusId, levelIds] of getNumberKeyedEntries(craftedTiers)) {
            if (equippedItem.bonusIds.includes(craftedBonusId)) {
                for (let index = 0; index <= levelIds.length; index++) {
                    const tierBonusId = levelIds[index];
                    if (tierBonusId === null) {
                        continue;
                    }

                    if (equippedItem.bonusIds.includes(tierBonusId)) {
                        return [index + 1, levelIds.length];
                    }
                }
            }
        }
        return [0, 0];
    };
    const getUpgradeData = () => {
        for (const bonusId of equippedItem.bonusIds) {
            if (wowthingData.items.itemBonusCurrentSeason.has(bonusId)) {
                const upgrades = wowthingData.items.itemBonusToUpgrade[bonusId];
                if (upgrades) {
                    return upgrades;
                }
            }
        }
    };
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

        > span {
            background-color: rgba(0, 0, 0, 0.75);
            padding: 0 3px 1px 3px;
        }
    }
    .embellishment,
    .enchant {
        font-size: 85%;
    }
    .gems {
        --image-border-width: 2px;

        display: flex;
        line-height: 1;
        gap: 2px;
    }
</style>

<div class="item" style:flex-direction={leftSide ? 'row-reverse' : 'row'}>
    <div class="item-icon" class:drop-shadow={equippedItem}>
        {#if equippedItem}
            {@const [craftedCurrent, craftedMax] = getCraftedData()}
            {@const upgradeData = getUpgradeData()}
            <a class="quality{equippedItem.quality}" href={getItemUrl(equippedItem)}>
                <WowthingImage name="item/{equippedItem.itemId}" size={56} border={2} />
                <span class="item-level pill abs-center">{equippedItem.itemLevel}</span>

                {#if upgradeData?.[0] > 0}
                    {@const upgradeString = $staticStore.sharedStrings[upgradeData[0]]}
                    {@const percent = (upgradeData[1] / upgradeData[2]) * 100}
                    <span
                        class="upgrade-level pill abs-center"
                        class:status-fail={percent === 0}
                        class:status-shrug={percent > 0 && percent < 100}
                        class:status-success={percent === 100}
                    >
                        {upgradeString.charAt(0)}
                        {upgradeData[1]} / {upgradeData[2]}
                    </span>
                {:else if craftedMax > 0}
                    <span class="upgrade-level pill abs-center">
                        <CraftedQualityIcon quality={craftedCurrent} />
                    </span>
                {/if}
            </a>
        {:else}
            <div class="empty-slot border"></div>
        {/if}
    </div>

    {#if equippedItem}
        {@const enchantmentIds = equippedItem.enchantmentIds || []}
        {@const gemIds = equippedItem.gemIds || []}
        <div class="item-text" style:align-items={leftSide ? 'flex-end' : 'flex-start'}>
            <span class="quality{equippedItem.quality}">
                {item?.name || `Item #${equippedItem?.itemId}`}
            </span>

            {#each embellishments as embellishment}
                <span class="embellishment quality8" data-id={embellishment.itemId}>
                    <WowheadLink id={embellishment.itemId} type="item">
                        {embellishment.displayName}
                    </WowheadLink>
                </span>
            {/each}

            {#if enchantmentIds.length > 0 || gemIds.length > 0}
                {@const enchantId = equippedItem.enchantmentIds[0]}
                <span class="gems">
                    {#each gemIds as gemId}
                        {@const gemItem = wowthingData.items.items[gemId]}
                        <span class="gem quality{gemItem?.quality}">
                            <WowheadLink id={gemId} type="item">
                                <WowthingImage name="item/{gemId}" size={20} />
                            </WowheadLink>
                        </span>
                    {/each}

                    {#if enchantId}
                        <span class="enchant">
                            <ParsedText
                                cls="quality2"
                                text={getEnchantmentText(
                                    enchantId,
                                    $staticStore.enchantments[enchantId]
                                )}
                            />
                        </span>
                    {/if}
                </span>
            {/if}
        </div>
    {/if}
</div>
