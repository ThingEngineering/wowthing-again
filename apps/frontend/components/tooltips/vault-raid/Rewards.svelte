<script lang="ts">
    import { itemStore } from '@/stores/item';
    import type { Character, CharacterItem } from '@/types'

    export let character: Character

    let rewards: [CharacterItem, CalculatedItemData][]
    $: rewards = [
        character.weekly.vault.raidProgress,
        character.weekly.vault.mythicPlusProgress,
        character.weekly.vault.rankedPvpProgress,
    ].flatMap((progress) => progress.flatMap((tier) => tier.rewards))
        .filter((reward) => !!reward)
        .map((reward) => [reward, applyBonusIds(reward)])

    type CalculatedItemData = {
        itemLevel: number;
        quality: number;
    }

    function applyBonusIds(rewardItem: CharacterItem): CalculatedItemData {
        const ret = {
            itemLevel: rewardItem.itemLevel,
            quality: rewardItem.quality,
        }

        if (ret.itemLevel === 0) {
            const item = $itemStore.items[rewardItem.itemId];
            ret.itemLevel = item.itemLevel;
            for (const bonusId of (rewardItem.bonusIds || [])) {
                const itemBonus = $itemStore.itemBonuses[bonusId];
                if (!itemBonus) { continue; }

                for (const bonus of (itemBonus.bonuses || [])) {
                    if (bonus[0] === 1) {
                        ret.itemLevel += bonus[1];
                    } else if (bonus[0] === 3) {
                        ret.quality = bonus[1];
                    } else if (bonus[0] === 42) {
                        ret.itemLevel = bonus[1];
                    }
                }
            }
        }

        return ret;
    }
</script>

<style lang="scss">
    thead tr td {
        border-top: 1px solid $border-color;
        padding-top: 1rem;
    }
    tbody tr:first-child td {
        border-top: 1px solid $border-color;
    }
    .item-level {
        @include cell-width(2.0rem);
        
        text-align: right;
    }
    .item-name {
        padding-left: 0.3rem;
        padding-right: 0.5rem;
        text-align: left;
    }
</style>

<table class="table-striped">
    <thead>
        <tr>
            <td colspan="2">Available rewards:</td>
        </tr>
    </thead>
    <tbody>
        {#each rewards as [reward, calculated]}
            {@const item = $itemStore.items[reward.itemId]}
            <tr>
                <td class="item-level">
                    {calculated.itemLevel}
                </td>
                <td class="item-name quality{calculated.quality}">
                    {item.name}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
