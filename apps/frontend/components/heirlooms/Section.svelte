<script lang="ts">
    import { ItemClass } from '@/enums/item-class';
    import { WeaponSubclass } from '@/enums/weapon-subclass';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { ManualDataHeirloomGroup } from '@/types/data/manual/heirloom';

    import Group from './Group.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    type Props = { groups: ManualDataHeirloomGroup[]; name: string };
    let { groups, name }: Props = $props();

    let totalCost = $derived.by(() => {
        let total = 0;

        for (const group of groups) {
            const isUnavailable = group.name.startsWith('Unavailable - ');

            for (const groupItem of group.items) {
                const item = wowthingData.items.items[groupItem.itemId];
                const costs =
                    item.classId === ItemClass.Armor ||
                    item.subclassId === WeaponSubclass.HeldInOffHand ||
                    item.subclassId === WeaponSubclass.Shield
                        ? armorCosts
                        : weaponCosts;

                const heirloom = wowthingData.static.heirloomByItemId.get(groupItem.itemId);
                const ranks = heirloom.upgradeBonusIds.length;

                const userLevel = userState.general.heirlooms.get(heirloom.id);
                // skip if this item is unavailable
                if (
                    settingsState.value.collections.hideUnavailable &&
                    isUnavailable &&
                    userLevel === undefined
                ) {
                    continue;
                }

                // if less than 6 ranks we get to use the higher tier upgrades 💸
                const fakeLevel = 6 - ranks + (userLevel || 0);

                for (let i = fakeLevel; i < 6; i++) {
                    total += costs[i + 1];
                }
            }
        }

        return total;
    });

    const armorCosts = [0, 500, 1000, 2000, 5000, 5000, 5000];
    const weaponCosts = [0, 750, 1500, 3000, 7500, 7500, 7500];
</script>

<style lang="scss">
    .total {
        margin-left: auto;
    }
</style>

<SectionTitle count={userState.heirloomStats[name.toUpperCase()]} title={name}>
    {#if totalCost > 0}
        <div class="total">Upgrade cost: {totalCost.toLocaleString()}g</div>
    {/if}
</SectionTitle>

<div class="collection-v2-section">
    {#each groups as group (group.name)}
        <Group {group} />
    {/each}
</div>
