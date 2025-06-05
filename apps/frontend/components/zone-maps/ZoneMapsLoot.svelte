<script lang="ts">
    import keyBy from 'lodash/keyBy';
    import orderBy from 'lodash/orderBy';

    import { weaponSubclassToString } from '@/data/weapons';
    import { ArmorType } from '@/enums/armor-type';
    import { RewardType } from '@/enums/reward-type';
    import { farmTypeIcons } from '@/shared/icons/mappings';
    import { staticStore } from '@/shared/stores/static';
    import { wowthingData } from '@/shared/stores/data';
    import { leftPad } from '@/utils/formatting';
    import { getDropData, getDropIcon } from '@/utils/zone-maps';
    import type { ManualDataZoneMapFarm } from '@/types/data/manual';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    export let loots: [ManualDataZoneMapFarm, number[]][];

    let allLoots: [ManualDataZoneMapFarm[], number[]][];
    $: {
        allLoots = [];
        const farmsById = keyBy(
            loots.map(([farm]) => farm),
            (farm) => farm.id
        );

        // Group by loot
        const groupedLoot: Record<string, [ManualDataZoneMapFarm, number][]> = {};
        for (const [farm, dropIndexes] of loots) {
            for (const dropIndex of dropIndexes) {
                const dropData = getDropData(farm.drops[dropIndex]);
                const dropKey = `${dropData.linkType}|${dropData.linkId}`;
                (groupedLoot[dropKey] ||= []).push([farm, dropIndex]);
            }
        }

        // Group groups by farms
        const groupedGroups: Record<string, string[]> = {};
        for (const [dropKey, farms] of Object.entries(groupedLoot)) {
            if (farms.length > 1) {
                const keys = orderBy(
                    farms,
                    ([farm]) => `${leftPad(farm.type, 2, '0')}${farm.name}`
                ).map(([farm]) => farm.id);
                (groupedGroups[keys.join('|')] ||= []).push(dropKey);
            } else {
                delete groupedLoot[dropKey];
            }
        }

        console.log({ groupedLoot, groupedGroups });

        // groupedGroups is now farmIds->dropTypeAndIds
        for (const [farmIdString, dropKeys] of Object.entries(groupedGroups)) {
            const dropIndexes: number[] = [];
            const farmIds = farmIdString.split('|').map((id) => parseInt(id));
            const farm = farmsById[farmIds[0]];
            for (const dropKey of dropKeys) {
                for (let i = 0; i < farm.drops.length; i++) {
                    const dropData = getDropData(farm.drops[i]);
                    if (`${dropData.linkType}|${dropData.linkId}` === dropKey) {
                        dropIndexes.push(i);
                        break;
                    }
                }
            }

            allLoots.push([farmIds.map((id) => farmsById[id]), dropIndexes]);
        }

        for (const [farm, dropIndexes] of orderBy(
            loots,
            ([farm]) => `${leftPad(farm.type, 2, '0')}${farm.name}`
        )) {
            let usableDropIndexes: number[] = [];
            for (const dropIndex of dropIndexes) {
                const dropData = getDropData(farm.drops[dropIndex]);
                const dropKey = `${dropData.linkType}|${dropData.linkId}`;
                if (!groupedLoot[dropKey]) {
                    usableDropIndexes.push(dropIndex);
                }
            }

            if (usableDropIndexes.length > 0) {
                allLoots.push([[farm], usableDropIndexes]);
            }
        }
    }
</script>

<style lang="scss">
    td {
        padding: 0.2rem;
    }
    .drops,
    .type {
        padding-right: 0.5rem;
    }
</style>

<table class="table table-striped">
    <tbody>
        {#each allLoots as [farms, dropIndexes]}
            {@const dropDatas = dropIndexes.map((dropIndex) =>
                getDropData(farms[0].drops[dropIndex])
            )}
            {@const dropCount = dropIndexes.length > 4 ? 3 : 4}
            <tr>
                <td class="name">
                    {#each farms as farm}
                        <div>
                            <IconifyIcon icon={farmTypeIcons[farm.type]} />
                            <ParsedText text={farm.name} />
                        </div>
                    {/each}
                </td>
                <td class="drops">
                    {#each dropIndexes.slice(0, dropCount) as dropIndex, dataIndex}
                        {@const drop = farms[0].drops[dropIndex]}
                        {@const dropData = dropDatas[dataIndex]}
                        {@const icon = getDropIcon($staticStore, drop, false)}
                        <div>
                            <IconifyIcon {icon} />
                            <span class="quality{dropData.quality}">
                                <WowheadLink id={dropData.linkId} type={dropData.linkType}>
                                    {dropData.name}
                                </WowheadLink>
                            </span>
                        </div>
                    {/each}

                    {#if dropIndexes.length > 4}
                        <div class="quality0">
                            ... and {dropIndexes.length - 3} more
                        </div>
                    {/if}
                </td>
                <td class="type">
                    {#each dropIndexes.slice(0, dropCount) as dropIndex}
                        {@const drop = farms[0].drops[dropIndex]}
                        <div>
                            {#if drop.type === RewardType.Armor}
                                {ArmorType[drop.subType].toLowerCase()}
                            {:else if drop.type === RewardType.Weapon}
                                {weaponSubclassToString[drop.subType].toLowerCase()}
                            {:else}
                                {RewardType[drop.type].toLowerCase()}
                            {/if}
                        </div>
                    {/each}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
