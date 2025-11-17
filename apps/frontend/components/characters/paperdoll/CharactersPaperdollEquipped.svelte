<script lang="ts">
    import { craftedTiers } from '@/data/crafted-gear';
    import { InventorySlot } from '@/enums/inventory-slot';
    import { wowthingData } from '@/shared/stores/data';
    import { getEnchantmentText } from '@/utils/get-enchantment-text';
    import { getItemUrl } from '@/utils/get-item-url';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { CharacterProps } from '@/types/props';

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { ItemBonusType } from '@/enums/item-bonus-type';

    type Props = CharacterProps & {
        inventorySlot: InventorySlot;
        leftSide?: boolean;
    };

    const { character, inventorySlot, leftSide }: Props = $props();

    let equippedItem = $derived(character.equippedItems[inventorySlot]);
    let item = $derived(wowthingData.items.items[equippedItem?.itemId]);

    let embellishments = $derived(
        (equippedItem?.bonusIds || [])
            .map((bonusId) => wowthingData.items.bonusIdToModifiedCrafting[bonusId])
            .filter((emb) => emb !== undefined)
    );

    let tertiary = $derived.by(() => {
        for (const bonusId of equippedItem?.bonusIds || []) {
            if (wowthingData.items.itemBonusAvoidance.has(bonusId)) {
                return 'Avoidance';
            } else if (wowthingData.items.itemBonusLeech.has(bonusId)) {
                return 'Leech';
            } else if (wowthingData.items.itemBonusSpeed.has(bonusId)) {
                return 'Movement Speed';
            }
        }
    });

    const effectSpells: Record<number, string> = {
        212387: '+1 Arcane Aegis',
        212376: '+2 Arcane Aegis',
        212369: '+3 Arcane Aegis',
        // +1 Arcane Ward,
        212711: '+2 Arcane Ward',
        212708: '+3 Arcane Ward',
        // +1 Brewing Storm,
        224299: '+2 Brewing Storm',
        224300: '+3 Brewing Storm',
        212292: '+1 Highmountain Fortitude',
        // +2 Highmountain Fortitude,
        212367: '+3 Highmountain Fortitude',
        215505: '+1 I Am My Scars!',
        215506: '+2 I Am My Scars!',
        215507: '+3 I Am My Scars!',
        215529: "+1 Light's Vengeance",
        215530: "+2 Light's Vengeance",
        215531: "+3 Light's Vengeance",
        212291: '+1 Souls of the Caw',
        212375: '+2 Souls of the Caw',
        212368: '+3 Souls of the Caw',
        212705: '+1 Storm Surger',
        212707: '+2 Storm Surger',
        212704: '+3 Storm Surger',
        // +1 Temporal Retaliation,
        // +2 Temporal Retaliation,
        212370: '+3 Temporal Retaliation',
        212293: '+1 Terror From Below',
        212373: '+2 Terror From Below',
        212366: '+3 Terror From Below',
        212294: '+1 Touch of Malice',
        212372: '+2 Touch of Malice',
        212365: '+3 Touch of Malice',
        212295: '+1 Volatile Magics',
        212371: '+2 Volatile Magics',
        212364: '+3 Volatile Magics',
    };
    let effectSpell = $derived.by(() => {
        for (const bonusId of equippedItem?.bonusIds || []) {
            const bonus = wowthingData.items.itemBonuses[bonusId];
            for (const bonusData of bonus?.bonuses || []) {
                if (bonusData[0] === ItemBonusType.ItemEffectId) {
                    if (effectSpells[bonusData[1]]) {
                        return effectSpells[bonusData[1]];
                    } else if (bonusData[1] < 214327 || bonusData[1] > 214333) {
                        console.log(bonusId, bonusData);
                    }
                }
            }
        }
        return '';
    });

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
                    {@const upgradeString = wowthingData.static.sharedStringById.get(
                        upgradeData[0]
                    )}
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

            {#if effectSpell}
                <span class="embellishment">{effectSpell}</span>
            {/if}

            {#if tertiary}
                <span class="embellishment status-shrug">{tertiary}</span>
            {/if}

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
                                    wowthingData.static.enchantmentById.get(enchantId)
                                )}
                            />
                        </span>
                    {/if}
                </span>
            {/if}
        </div>
    {/if}
</div>
