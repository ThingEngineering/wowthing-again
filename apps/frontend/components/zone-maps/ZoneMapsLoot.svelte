<script lang="ts">
    import { weaponSubclassToString } from '@/data/weapons'
    import { ArmorType } from '@/enums/armor-type'
    import { RewardType } from '@/enums/reward-type'
    import { farmTypeIcons, rewardTypeIcons } from '@/shared/icons/mappings'
    import { getDropData } from '@/utils/zone-maps'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import type { ManualDataZoneMapFarm } from '@/types/data/manual'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'

    export let loots: [ManualDataZoneMapFarm, number[]][]
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
        {#each loots as [farm, dropIndexes]}
            {@const dropDatas = dropIndexes.map((dropIndex) => getDropData(farm.drops[dropIndex]))}
            {@const dropCount = dropIndexes.length > 4 ? 3 : 4}
            <tr>
                <td class="name">
                    <IconifyIcon icon={farmTypeIcons[farm.type]} />
                    {farm.name}
                </td>
                <td class="drops">
                    {#each dropIndexes.slice(0, dropCount) as dropIndex, dataIndex}
                        {@const drop = farm.drops[dropIndex]}
                        {@const dropData = dropDatas[dataIndex]}
                        <div>
                            <IconifyIcon icon={rewardTypeIcons[drop.type]} />
                            <span class="quality{dropData.quality}">
                                <WowheadLink
                                    id={dropData.linkId}
                                    type={dropData.linkType}
                                >
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
                        {@const drop = farm.drops[dropIndex]}
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
