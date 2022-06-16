<script lang="ts">
    import mdiMessageBulleted from '@iconify/icons-mdi/message-bulleted'
    import difference from 'lodash/difference'
    import sortBy from 'lodash/sortBy'

    import { dropTypeIcon } from '@/data/farm'
    import { weaponSubclassToString } from '@/data/weapons'
    import { userAchievementStore, userStore } from '@/stores'
    import { ArmorType, FarmDropType, FarmResetType } from '@/types/enums'
    import type { DropStatus, FarmStatus } from '@/types'
    import type { ZoneMapDataDrop, ZoneMapDataFarm } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let farm: ZoneMapDataFarm
    export let status: FarmStatus

    let sortedDrops: [ZoneMapDataDrop, DropStatus][]
    let statistic: number
    $: {
        console.log({farm, status})

        const sigh: [ZoneMapDataDrop, DropStatus][] = []
        for (let dropIndex = 0; dropIndex < farm.drops.length; dropIndex++) {
            sigh.push([farm.drops[dropIndex], status.drops[dropIndex]])
        }

        sortedDrops = sortBy(sigh, (s) => [!s[1].need, !s[1].validCharacters])

        if (farm.statisticId > 0) {
            statistic = ($userAchievementStore.data.statistics?.[farm.statisticId] || [])
                .reduce((a, b) => a + b[1], 0)
            console.log(statistic)
        }
    }

    const showCharacters = (dropStatus: DropStatus, nextDrop: [ZoneMapDataDrop, DropStatus]): boolean => {
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
    .note {
        color: #00ccff;
        font-size: 0.95rem;
    }
    p.note {
        border-bottom: 1px solid $border-color;
        margin: 0;
        padding: 0.1rem 0.5rem 0.2rem 0.5rem;
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
    <h4>{farm.name}</h4>

    {#if farm.reset !== FarmResetType.None && farm.reset !== FarmResetType.Never}
        <h5>{FarmResetType[farm.reset].toLowerCase()} reset</h5>
    {/if}

    {#if farm.note}
        <p class="note">{farm.note}</p>
    {/if}

    <table class="table-tooltip-farm table-striped">
        <tbody>
            {#if statistic > 0}
                 <tr class="statistic">
                    <td colspan="3">{statistic.toLocaleString()} attempts</td>
                </tr>
            {/if}

            {#each sortedDrops as [drop, dropStatus], sortedIndex}
                <tr
                    class:success={!dropStatus.need || !dropStatus.validCharacters || dropStatus.skip}
                >
                    <td class="type status-{dropStatus.need ? 'fail' : 'success'}">
                        <IconifyIcon icon={dropTypeIcon[drop.type]} />
                    </td>
                    <td class="name" class:status-success={!dropStatus.need}>{drop.name}</td>
                    <td class="limit">
                        {#if drop.limit?.length > 0}
                            {drop.limit[1]}
                            {#if drop.limit.length > 2}
                                [ {drop.limit.slice(2).join(', ')} ]
                            {/if}
                        {:else if drop.type === FarmDropType.Cosmetic}
                            cosmetic
                        {:else if drop.type === FarmDropType.Armor}
                            {ArmorType[drop.subType].toLowerCase()}
                        {:else if drop.type === FarmDropType.Weapon}
                            {weaponSubclassToString[drop.subType]}
                        {:else}
                            {FarmDropType[drop.type].toLowerCase()}
                        {/if}
                    </td>
                </tr>

                {#if dropStatus.need && !dropStatus.skip}
                    {#if showCharacters(dropStatus, sortedDrops[sortedIndex+1])}
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

                    {#if drop.note}
                        <tr>
                            <td></td>
                            <td class="characters note" colspan="2">
                                <IconifyIcon
                                        icon={mdiMessageBulleted}
                                        scale="0.9"
                                />
                                {drop.note}
                            </td>
                        </tr>
                    {/if}
                {/if}
            {/each}
        </tbody>
    </table>
</div>
