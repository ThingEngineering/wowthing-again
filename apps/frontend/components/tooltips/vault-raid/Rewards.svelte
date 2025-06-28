<script lang="ts">
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import { inventoryTypeIcons } from '@/shared/icons/mappings';
    import { wowthingData } from '@/shared/stores/data';
    import type { Character, CharacterItem } from '@/types';

    export let character: Character;

    let rewards: [CharacterItem, CalculatedItemData][];
    $: rewards = [
        character.weekly.vault.raidProgress,
        character.weekly.vault.dungeonProgress,
        character.weekly.vault.worldProgress,
    ]
        .flatMap((progress) => progress.flatMap((tier) => tier.rewards))
        .filter((reward) => !!reward)
        .map((reward) => [reward, applyBonusIds(reward)]);

    type CalculatedItemData = {
        itemLevel: number;
        quality: number;
    };

    function applyBonusIds(rewardItem: CharacterItem): CalculatedItemData {
        const ret = {
            itemLevel: rewardItem.itemLevel,
            quality: rewardItem.quality,
        };

        if (ret.itemLevel === 0) {
            const item = wowthingData.items.items[rewardItem.itemId];
            ret.itemLevel = item.itemLevel;
            for (const bonusId of rewardItem.bonusIds || []) {
                const itemBonus = wowthingData.items.itemBonuses[bonusId];
                if (!itemBonus) {
                    continue;
                }

                for (const bonus of itemBonus.bonuses || []) {
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
        border-top: 1px solid var(--border-color);
        padding-top: 1rem;
    }
    tbody tr:first-child td {
        border-top: 1px solid var(--border-color);
    }
    .icon {
        text-align: center;
        width: 2rem;
    }
    .item-level {
        --width: 2rem;

        text-align: center;
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
            <td colspan="3">Available rewards:</td>
        </tr>
    </thead>
    <tbody>
        {#each rewards as [reward, calculated]}
            {@const item = wowthingData.items.items[reward.itemId]}
            <tr>
                <td class="icon">
                    <IconifyIcon icon={inventoryTypeIcons[item.inventoryType]} />
                </td>
                <td class="item-level sized">
                    {calculated.itemLevel}
                </td>
                <td class="item-name quality{calculated.quality}">
                    {item.name}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
