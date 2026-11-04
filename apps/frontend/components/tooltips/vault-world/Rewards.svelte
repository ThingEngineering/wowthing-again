<script lang="ts">
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import { inventoryTypeIcons } from '@/shared/icons/mappings';
    import { wowthingData } from '@/shared/stores/data';
    import { applyBonusIds } from '@/utils/items/apply-bonus-ids';
    import type { CharacterItem } from '@/types';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let rewards: [CharacterItem, ReturnType<typeof applyBonusIds>][] = $derived(
        [
            character.weekly.vault.raidProgress,
            character.weekly.vault.dungeonProgress,
            character.weekly.vault.worldProgress,
        ]
            .flatMap((progress) => progress.flatMap((tier) => tier.rewards))
            .filter((reward) => !!reward)
            .map((reward) => [
                reward,
                applyBonusIds(reward.bonusIds, {
                    itemLevel: reward.itemLevel,
                    quality: reward.quality,
                }),
            ])
    );
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
                    <IconifyWrapper icon={inventoryTypeIcons[item.inventoryType]} />
                </td>
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
