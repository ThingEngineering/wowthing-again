<script lang="ts">
    import difference from 'lodash/difference'
    import sortBy from 'lodash/sortBy'

    import { iconStrings, imageStrings, rewardTypeIcons } from '@/data/icons'
    import { weaponSubclassToString } from '@/data/weapons'
    import { achievementStore, manualStore, staticStore, userAchievementStore, userStore } from '@/stores'
    import { ArmorType, RewardType, FarmResetType, FarmType } from '@/types/enums'
    import type { DropStatus, FarmStatus } from '@/types'
    import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from '@/types/data/manual'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let farm: ManualDataZoneMapFarm
    export let status: FarmStatus

    let sortedDrops: [ManualDataZoneMapDrop, DropStatus][]
    let statistic: number
    $: {
        const sigh: [ManualDataZoneMapDrop, DropStatus][] = []
        for (let dropIndex = 0; dropIndex < farm.drops.length; dropIndex++) {
            sigh.push([farm.drops[dropIndex], status.drops[dropIndex]])
        }

        sortedDrops = sortBy(sigh, (s) => [!s[1].need, !s[1].validCharacters])

        if (farm.statisticId > 0) {
            statistic = ($userAchievementStore.data.statistics?.[farm.statisticId] || [])
                .reduce((a, b) => a + b[1], 0)
        }
    }

    const getDropName = (drop: ManualDataZoneMapDrop): string => {
        if (drop.type === RewardType.Item ||
            drop.type === RewardType.Cosmetic ||
            drop.type === RewardType.Armor ||
            drop.type === RewardType.Weapon ||
            drop.type === RewardType.Transmog) {
            return $manualStore.data.shared.items[drop.id]?.name || `Unknown item #${drop.id}`
        }
        else if (drop.type === RewardType.Achievement) {
            if (drop.subType > 0) {
                return $achievementStore.data.criteriaTree[drop.subType]?.description ?? `Criteria #${drop.subType}`
            }
            else {
                return $achievementStore.data.achievement[drop.id]?.name ?? `Achievement #${drop.id}`
            }
        }
        else if (drop.type === RewardType.Mount) {
            const mount = $staticStore.data.mounts[drop.id]
            return mount ? mount.name : `Unknown mount #${drop.id}`
        }
        else if (drop.type === RewardType.Pet) {
            const pet = $staticStore.data.pets[drop.id]
            return pet ? pet.name : `Unknown pet #${drop.id}`
        }
        else if (drop.type === RewardType.Toy) {
            const toy = $staticStore.data.toys[drop.id]
            return toy ? toy.name : `Unknown toy #${drop.id}`
        }
        else {
            return "???"
        }
    }

    const showCharacters = (drop: ManualDataZoneMapDrop, dropStatus: DropStatus, nextDrop: [ManualDataZoneMapDrop, DropStatus]): boolean => {
        if (farm.type === FarmType.Vendor && drop.type !== RewardType.Quest) {
            return false
        }

        if (nextDrop) {
            // If they both have no valid characters, bail early
            if (!dropStatus.validCharacters && !nextDrop[1].validCharacters) {
                return false
            }

            // Simple length check
            if (
                dropStatus.validCharacters !== nextDrop[1].validCharacters ||
                dropStatus.characterIds.length !== nextDrop[1].characterIds.length ||
                dropStatus.completedCharacterIds.length !== nextDrop[1].completedCharacterIds.length
            ) {
                return true
            }

            // Compare this drop to the next one - if the character list is the same we don't need to show it
            const charDiff = difference(dropStatus.characterIds, nextDrop[1].characterIds)
            const completeDiff = difference(dropStatus.completedCharacterIds, nextDrop[1].completedCharacterIds)

            return charDiff.length > 0 || completeDiff.length > 0
        }
        else
        {
            return !dropStatus.validCharacters
                || dropStatus.characterIds.length > 0
                || dropStatus.completedCharacterIds.length > 0
        }
    }
</script>

<style lang="scss">
    h4 {
        :global(img) {
            margin-top: -4px;
        }
        :global(svg) {
            color: #ffff00;
            margin: -4px -4px 0 -4px;
        }
    }
    .statistic {
        background: #232;
    }
    .note {
        color: #00ddff;
        font-size: 0.95rem;
    }
    p.note {
        border-bottom: 1px solid $border-color;
        margin: 0;
        padding: 0.1rem 0.5rem 0.2rem 0.5rem;
    }
    td.note {
        padding-left: 0;
        text-align: left;
    }
    .type {
        width: 1.6rem;
    }
    .name {
        max-width: 16rem;
        overflow: hidden;
        padding-left: 0;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .limit {
        text-align: left;
        white-space: nowrap;
        word-spacing: -0.2ch;
    }
    .success {
        opacity: 0.7;
    }
    .characters {
        padding-left: 0;
        text-align: left;

        span {
            display: inline-block;
            white-space: nowrap;

            &.completed {
                text-decoration: line-through 3px;
            }
        }

        span:not(:last-child) {
            margin-right: 0.3rem;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>
        {#if farm.faction}
            <WowthingImage
                name={farm.faction === 'alliance' ? imageStrings.alliance : imageStrings.horde}
                border={1}
                size={20}
            />
        {/if}

        {#if farm.type === FarmType.Quest}
            <IconifyIcon
                icon={iconStrings.exclamation}
            />
        {/if}

        {farm.name}
    </h4>

    {#if farm.type !== FarmType.Vendor && farm.reset !== FarmResetType.None && farm.reset !== FarmResetType.Never}
        <h5>{FarmResetType[farm.reset].toLowerCase()} reset</h5>
    {/if}

    {#if farm.note}
        <p class="note">{farm.note}</p>
    {/if}

    <table class="table-tooltip-farm table-striped">
        <tbody>
            {#if statistic > 0}
                 <tr>
                    <td class="statistic" colspan="3">{statistic.toLocaleString()} attempts</td>
                </tr>
            {/if}

            {#each sortedDrops as [drop, dropStatus], sortedIndex}
                <tr
                    class:success={!dropStatus.need || !dropStatus.validCharacters || dropStatus.skip}
                >
                    <td class="type status-{dropStatus.need ? 'fail' : 'success'}">
                        <IconifyIcon icon={rewardTypeIcons[drop.type]} />
                    </td>
                    <td
                        class="name"
                        class:status-success={!dropStatus.need}
                    >
                        {getDropName(drop)}
                    </td>
                    <td class="limit">
                        {#if drop.limit?.length > 0}
                            {drop.limit[1]}
                            {#if drop.limit.length > 2}
                                [ {drop.limit.slice(2).join(', ')} ]
                            {/if}
                        {:else if drop.type === RewardType.Cosmetic}
                            cosmetic
                        {:else if drop.type === RewardType.Armor}
                            {ArmorType[drop.subType].toLowerCase()}
                        {:else if drop.type === RewardType.Weapon}
                            {weaponSubclassToString[drop.subType]}
                        {:else}
                            {RewardType[drop.type].toLowerCase()}
                        {/if}
                    </td>
                </tr>

                {#if dropStatus.need && !dropStatus.skip}
                    {#if drop.note || drop.type === RewardType.Achievement}
                        <tr>
                            <td></td>
                            <td class="note" colspan="2">
                                {#if drop.note}
                                    <ParsedText text={drop.note} />
                                {:else if drop.type === RewardType.Achievement}
                                    {#if drop.subType > 0}
                                        <IconifyIcon icon={rewardTypeIcons[RewardType.Achievement]} />
                                        {$achievementStore.data.achievement[drop.id].name}
                                    {:else}
                                        {$achievementStore.data.achievement[drop.id].description}
                                    {/if}
                                {/if}
                            </td>
                        </tr>
                    {/if}
                    
                    {#if showCharacters(drop, dropStatus, sortedDrops[sortedIndex+1])}
                        {#if dropStatus.characterIds.length > 0 || dropStatus.completedCharacterIds.length > 0}
                            <tr>
                                <td></td>
                                <td class="characters" colspan="2">
                                    {#each sortBy(
                                        dropStatus.characterIds
                                            .map(c => $userStore.data.characterMap[c]),
                                        c => c.name)
                                    as character}
                                        <span class="class-{character.classId}">{character.name}</span>
                                    {/each}
                                    {#each sortBy(
                                        dropStatus.completedCharacterIds
                                            .map(c => $userStore.data.characterMap[c]),
                                        c => c.name)
                                    as character}
                                        <span class="completed class-{character.classId}">{character.name}</span>
                                    {/each}
                                </td>
                            </tr>
                        {/if}

                        {#if !dropStatus.validCharacters}
                            <tr class="status-fail">
                                <td></td>
                                <td class="characters" colspan="2">
                                    &lt;no valid characters&gt;
                                </td>
                            </tr>
                        {/if}
                    {/if}
                {/if}
            {/each}
        </tbody>
    </table>
</div>
