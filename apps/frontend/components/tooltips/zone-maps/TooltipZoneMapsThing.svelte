<script lang="ts">
    import difference from 'lodash/difference';
    import sortBy from 'lodash/sortBy';

    import { expansionMap } from '@/data/expansion';
    import { iconStrings, imageStrings } from '@/data/icons';
    import { professionSlugToId } from '@/data/professions';
    import { weaponSubclassToString } from '@/data/weapons';
    import { ArmorType } from '@/enums/armor-type';
    import { FarmIdType } from '@/enums/farm-id-type';
    import { FarmResetType } from '@/enums/farm-reset-type';
    import { FarmType } from '@/enums/farm-type';
    import { LookupType } from '@/enums/lookup-type';
    import { RewardType } from '@/enums/reward-type';
    import {
        achievementStore,
        itemStore,
        lazyStore,
        userAchievementStore,
        userStore,
    } from '@/stores';
    import { rewardTypeIcons } from '@/shared/icons/mappings';
    import { staticStore } from '@/shared/stores/static';
    import { leftPad } from '@/utils/formatting';
    import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
    import { getDropIcon, getDropName } from '@/utils/zone-maps';
    import type { DropStatus, FarmStatus } from '@/types';
    import type {
        ManualDataZoneMapCategory,
        ManualDataZoneMapDrop,
        ManualDataZoneMapFarm,
    } from '@/types/data/manual';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let drops: ManualDataZoneMapDrop[];
    export let farm: ManualDataZoneMapFarm;
    export let map: ManualDataZoneMapCategory;
    export let status: FarmStatus;
    export let worldQuestAvailable: number;

    let sortedDrops: [ManualDataZoneMapDrop, DropStatus][];
    let statistic: number;
    $: {
        const sigh: [ManualDataZoneMapDrop, DropStatus][] = [];
        for (let dropIndex = 0; dropIndex < drops.length; dropIndex++) {
            sigh.push([drops[dropIndex], status.drops[dropIndex]]);
        }

        sortedDrops = sortBy(sigh, (s) => [!s[1].need, !s[1].validCharacters]);

        if (farm.statisticId > 0) {
            statistic = ($userAchievementStore.statistics?.[farm.statisticId] || []).reduce(
                (a, b) => a + b[1],
                0
            );
        }
    }

    const showCharacters = (
        drop: ManualDataZoneMapDrop,
        dropStatus: DropStatus,
        nextDrop: [ManualDataZoneMapDrop, DropStatus]
    ): boolean => {
        if (farm.type === FarmType.Vendor && drop.type !== RewardType.Quest) {
            return false;
        }
        if (map.mapName === 'misc_exiles_reach') {
            return false;
        }

        if (nextDrop) {
            // If they both have no valid characters, bail early
            if (!dropStatus.validCharacters && !nextDrop[1].validCharacters) {
                return false;
            }

            // Simple length check
            if (
                dropStatus.validCharacters !== nextDrop[1].validCharacters ||
                dropStatus.characterIds.length !== nextDrop[1].characterIds.length ||
                dropStatus.completedCharacterIds.length !== nextDrop[1].completedCharacterIds.length
            ) {
                return true;
            }

            // Compare this drop to the next one - if the character list is the same we don't need to show it
            const charDiff = difference(dropStatus.characterIds, nextDrop[1].characterIds);
            const completeDiff = difference(
                dropStatus.completedCharacterIds,
                nextDrop[1].completedCharacterIds
            );

            return charDiff.length > 0 || completeDiff.length > 0;
        } else {
            return (
                !dropStatus.validCharacters ||
                dropStatus.characterIds.length > 0 ||
                dropStatus.completedCharacterIds.length > 0
            );
        }
    };
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
    h5 {
        span {
            padding-left: 0.5rem;
        }
    }
    .statistic {
        background: #232;
    }
    .wowthing-tooltip {
        :global(.note) {
            color: #00ddff;
            font-size: 0.95rem;
        }

        :global(span.note) {
            border-bottom: 1px solid $border-color;
            display: block;
            margin: 0;
            padding: 0.1rem 0.5rem 0.2rem 0.5rem;
        }
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
        max-width: 12rem;
        min-width: 5rem;
        text-align: left;
        white-space: nowrap;
        width: 5rem;

        :global(code) {
            color: $body-text;
            word-spacing: normal;
        }
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
            <IconifyIcon icon={iconStrings.exclamation} />
        {/if}

        <ParsedText text={farm.name} />
    </h4>

    {#if farm.type !== FarmType.Vendor}
        <h5>
            {#if farm.reset === FarmResetType.Never}
                once per character
            {:else if farm.reset !== FarmResetType.None}
                {FarmResetType[farm.reset].toLowerCase()} reset
                {#if worldQuestAvailable === 1}
                    <span class="status-success">World Quest available!</span>
                {:else if worldQuestAvailable === -1}
                    <span class="status-warn">World Quest not available</span>
                {/if}
            {/if}
        </h5>
    {/if}

    {#if farm.note}
        <ParsedText cls="note" text={farm.note} />
    {/if}

    <table class="table-tooltip-farm table-striped">
        <tbody>
            {#if statistic > 0}
                <tr>
                    <td class="statistic" colspan="3">{statistic.toLocaleString()} attempts</td>
                </tr>
            {/if}

            {#if farm.idType == FarmIdType.Instance}
                {@const stats = $lazyStore.journal.stats[status.link.replace('/', '--')]}
                <tr>
                    <td colspan="3">
                        {stats.have} / {stats.total} unique drops
                    </td>
                </tr>
            {/if}

            {#each sortedDrops.slice(0, 22) as [drop, dropStatus], sortedIndex (drop)}
                {@const isCriteria = drop.type === RewardType.Achievement && drop.subType > 0}
                <tr
                    class:success={!dropStatus.need ||
                        !dropStatus.validCharacters ||
                        dropStatus.skip ||
                        (dropStatus.need && dropStatus.characterIds.length === 0)}
                >
                    <td
                        class="type status-{dropStatus.need && dropStatus.characterIds.length > 0
                            ? 'fail'
                            : 'success'}"
                    >
                        <IconifyIcon
                            icon={getDropIcon($itemStore, $staticStore, drop, isCriteria)}
                        />
                    </td>
                    <td class="name" class:status-success={!dropStatus.need}>
                        {#if drop.amount > 0}
                            {drop.amount}x
                        {/if}
                        {getDropName(drop)}
                    </td>
                    <td class="limit">
                        {#if drop.type === RewardType.Cosmetic}
                            cosmetic
                        {:else if drop.type === RewardType.Armor}
                            {ArmorType[drop.subType].toLowerCase()}
                            {#if drop.subType >= 1 && drop.subType <= 4}
                                {$staticStore.inventoryTypes[
                                    $itemStore.items[drop.id]?.inventoryType
                                ].toLowerCase()}
                            {/if}
                        {:else if drop.type === RewardType.Weapon}
                            {weaponSubclassToString[drop.subType].toLowerCase()}
                        {:else if drop.type === RewardType.InstanceSpecial}
                            {@html drop.limit[0]}
                        {:else if drop.type === RewardType.SetSpecial}
                            <code
                                >{@html leftPad(dropStatus.setHave, 2)} / {@html leftPad(
                                    dropStatus.setNeed,
                                    2
                                )}</code
                            >
                        {:else if drop.type === RewardType.XpQuest}
                            quest
                        {:else if isCriteria}
                            criteria
                        {:else if drop.limit?.length > 0 && !['level', 'quest'].includes(drop.limit[0])}
                            {drop.limit[1]}
                            {#if drop.limit.length > 2}
                                {#if drop.limit[0] === 'profession'}
                                    {#if drop.limit[2]?.match(/^\d+$/)}
                                        {@const expansion =
                                            expansionMap[
                                                $staticStore.professions[
                                                    professionSlugToId[drop.limit[1]]
                                                ].subProfessions.findIndex(
                                                    (sub) => sub.id === parseInt(drop.limit[2])
                                                )
                                            ]}
                                        [<span class="status-shrug"
                                            >{expansion.shortName.toLocaleLowerCase()}
                                            {drop.limit[3]}</span
                                        >]
                                    {:else}
                                        [<span class="status-shrug"
                                            >{drop.limit[2].toLocaleUpperCase()}
                                            {drop.limit[3]}</span
                                        >]
                                    {/if}
                                {:else}
                                    [{drop.limit.slice(2).join(', ')}]
                                {/if}
                            {/if}
                        {:else if drop.type === RewardType.Item}
                            {@const [lookupType] = rewardToLookup($staticStore, drop.type, drop.id)}
                            {#if lookupType !== LookupType.None}
                                {LookupType[lookupType].toLowerCase()}
                            {:else}
                                item
                            {/if}
                        {:else}
                            {RewardType[drop.type].toLowerCase()}
                        {/if}
                    </td>
                </tr>

                {#if dropStatus.need && !dropStatus.skip}
                    {#if sortedDrops.length < 10 && ((drop.note && drop.type !== RewardType.CharacterTrackingQuest) || drop.type === RewardType.Achievement || dropStatus.setNote)}
                        <tr>
                            <td></td>
                            <td class="note" colspan="2">
                                {#if drop.note}
                                    <ParsedText text={drop.note} />
                                {:else if drop.type === RewardType.Achievement}
                                    {#if drop.subType > 0}
                                        <IconifyIcon
                                            icon={rewardTypeIcons[RewardType.Achievement]}
                                        />
                                        {$achievementStore.achievement[drop.id].name}
                                    {:else}
                                        {$achievementStore.achievement[drop.id].description}
                                    {/if}
                                {:else if dropStatus.setNote}
                                    <ParsedText text={dropStatus.setNote} />
                                {/if}
                            </td>
                        </tr>
                    {/if}

                    {#if showCharacters(drop, dropStatus, sortedDrops[sortedIndex + 1])}
                        {#if dropStatus.characterIds.length > 0 || dropStatus.completedCharacterIds.length > 0}
                            <tr>
                                <td></td>
                                <td class="characters" colspan="2">
                                    {#each sortBy( dropStatus.characterIds.map((c) => $userStore.characterMap[c]), (c) => c.name ) as character (character.id)}
                                        <span class="class-{character.classId}">
                                            {character.name}
                                        </span>
                                    {/each}
                                    {#each sortBy( dropStatus.completedCharacterIds.map((c) => $userStore.characterMap[c]), (c) => c.name ) as character (character.id)}
                                        <span class="completed class-{character.classId}">
                                            {character.name}
                                        </span>
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

            {#if sortedDrops.length > 22}
                <tr>
                    <td colspan="3">... and {sortedDrops.length - 22} more</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>
