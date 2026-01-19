<script lang="ts">
    import find from 'lodash/find';

    import { Constants } from '@/data/constants';
    import { seasonMap } from '@/data/mythic-plus';
    import { timeStore } from '@/shared/stores/time';
    import { userStore } from '@/stores';
    import { leftPad } from '@/utils/formatting';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import { getWeeklyAffixes } from '@/utils/mythic-plus';
    import type { Character, CharacterMythicPlusRun } from '@/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import HeadDungeon from './MythicPlusTableHeadDungeon.svelte';
    import HeadItemLevel from '@/components/character-table/head/ItemLevel.svelte';
    import HeadKeystone from '@/components/character-table/head/Keystone.svelte';
    import HeadRaiderIo from '@/components/character-table/head/RaiderIo.svelte';
    import HeadVault from '@/components/character-table/head/Vault.svelte';
    import RowDungeon from './MythicPlusTableRowDungeon.svelte';
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte';
    import RowKeystone from '@/components/character-table/row/Keystone.svelte';
    import RowRaiderIo from '@/components/character-table/row/RaiderIo.svelte';
    import RowVaultDungeon from '@/components/character-table/row/VaultDungeon.svelte';
    import TableFoot from './TableFoot.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { slug }: { slug: string } = $props();

    let isThisWeek = $derived(slug === 'this-week');
    let season = $derived(
        isThisWeek
            ? seasonMap[Constants.mythicPlusSeason]
            : find(seasonMap, (season) => season.slug === slug)
    );
    let isCurrentSeason = $derived(
        season.id === Constants.mythicPlusSeason || season.id === Constants.remixMythicPlusSeason
    );
    let affixes = $derived(isCurrentSeason ? getWeeklyAffixes() : []);

    let runsFunc: (char: Character, dungeonId: number) => CharacterMythicPlusRun[] = $derived.by(
        () => {
            if (isThisWeek) {
                return (char, dungeonId) => {
                    const currentPeriod = userStore.getCurrentPeriodForCharacter($timeStore, char);
                    const startStamp = currentPeriod.startTime.toUnixInteger();
                    const endStamp = currentPeriod.endTime.toUnixInteger();

                    for (const [timestamp, runs] of Object.entries(char.mythicPlusWeeks || {})) {
                        const weekStamp = parseInt(timestamp);
                        if (weekStamp > startStamp && weekStamp <= endStamp) {
                            return runs
                                .filter((run) => run.mapId === dungeonId)
                                .map(
                                    (run) =>
                                        ({
                                            completed: '???',
                                            dungeonId: run.mapId,
                                            keystoneLevel: run.level,

                                            affixes: [],
                                            duration: 0,
                                            members: [],
                                            memberObjects: [],
                                            timed: true,
                                        }) as CharacterMythicPlusRun
                                );
                        }
                    }
                    return [];
                };
            } else {
                const seasonId =
                    season?.id === Constants.remixMythicPlusSeason
                        ? Constants.mythicPlusSeason
                        : season?.id;
                return (char, dungeonId) => char.mythicPlus?.seasons?.[seasonId]?.[dungeonId];
            }
        }
    );

    let sortFunc = $derived(
        getCharacterSortFunc((char) => {
            return leftPad(
                100000 -
                    Math.floor(
                        (char.mythicPlusSeasonScores[season?.id] ||
                            char.raiderIo?.[season?.id]?.all ||
                            0) * 10
                    ),
                6,
                '0'
            );
        })
    );

    let filterFunc = $derived((char: Character) => {
        const meetsLevelReq = char.level >= season.minLevel;
        if (char.isRemix) {
            return meetsLevelReq && season.id === Constants.remixMythicPlusSeason;
        } else {
            const score =
                char.mythicPlusSeasonScores?.[season.id] || char.raiderIo?.[season.id]?.all || 0;
            return meetsLevelReq && score > 0;
        }
    });
</script>

<style lang="scss">
    th {
        --image-margin-top: -4px;

        vertical-align: bottom;
    }
    .no-characters {
        padding: 0.3rem 0.5rem;
        white-space: normal;
    }
</style>

<CharacterTable skipGrouping={!isThisWeek} skipIgnored={true} {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
        {#if isCurrentSeason}
            <HeadItemLevel />
        {/if}

        {#if season.id === Constants.remixMythicPlusSeason}
            <th>
                <WowthingImage name="spell/1245947" size={16} border={2} cls="quality6-border" />
            </th>
        {/if}

        <HeadRaiderIo />

        {#if isCurrentSeason}
            <HeadKeystone {affixes} />
        {/if}

        {#if isThisWeek}
            <HeadVault vaultType="M+" />
        {/if}

        {#key season.id}
            {#each season.orders as order}
                {#each order as dungeonId}
                    <HeadDungeon {dungeonId} />
                {/each}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#if isCurrentSeason}
                <RowItemLevel {character} />
            {/if}

            <RowRaiderIo {character} {season} />

            {#if isCurrentSeason}
                <RowKeystone {character} />
            {/if}

            {#if isThisWeek}
                <RowVaultDungeon {character} />
            {/if}

            {#each season.orders as order}
                {#each order as dungeonId}
                    <RowDungeon season={isThisWeek ? null : season} {dungeonId} {runsFunc} />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>

    <TableFoot
        slot="foot"
        extraColSpan={(isCurrentSeason ? 2 : 0) + 1 + (isThisWeek ? 1 : 0)}
        {isThisWeek}
        {season}
    />

    <svelte:fragment slot="emptyRow">
        <tr>
            <td class="no-characters bg-fail" colspan="99">
                You have no characters with an M+ score from this season.
            </td>
        </tr>
    </svelte:fragment>
</CharacterTable>
