<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { progressState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import getProgress from '@/utils/get-progress';
    import { leftPad } from '@/utils/formatting';
    import type { Character } from '@/types';
    import type { ProgressInfo } from '@/utils/get-progress';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import HeadCovenant from '@/components/home/table/head/HomeTableHeadCovenant.svelte';
    import HeadProgress from './ProgressTableHead.svelte';
    import RowCovenant from '@/components/home/table/row/HomeTableRowCovenant.svelte';
    import RowProgress from './ProgressTableBody.svelte';
    import RowProgressRaidSkip from './ProgressTableBodyRaidSkip.svelte';

    let { slug1, slug2 }: { slug1: string; slug2: string } = $props();

    let slugKey = $derived(`${slug1}|${slug2}`);

    let [categories, firstCategory] = $derived.by(() => {
        let retCategories =
            wowthingData.manual.progressSets.find((p) => p !== null && p[0].slug === slug1) || [];

        let retFirstCategory = retCategories[0];

        if (slug2) {
            retCategories = categories.filter((s) => s !== null && s.slug === slug2);
        }

        return [retCategories, retFirstCategory];
    });

    let minimumLevel = $derived.by(() => {
        const minimumLevels = [firstCategory, ...categories]
            .map((cat) => cat?.minimumLevel || 0)
            .filter((ml) => (ml || 0) > 0);
        return minimumLevels.length > 0 ? Math.min(...minimumLevels) : 0;
    });

    let requiredQuestIds = $derived(
        firstCategory.requiredQuestIds.concat(categories[0].requiredQuestIds)
    );

    let filterFunc = $derived((char: Character) => {
        if (minimumLevel > 0 && char.level < minimumLevel) {
            return false;
        }

        if (
            requiredQuestIds.length > 0 &&
            !requiredQuestIds.some((id) =>
                userState.quests.characterById.get(char.id)?.hasQuestById?.has(id)
            )
        ) {
            return false;
        }

        if (
            categories[0]?.groups[0]?.type === 'dragon-racing' ||
            categories[1]?.groups[0]?.type === 'dragon-racing'
        ) {
            return categories
                .filter((cat) => !!cat)
                .some((cat) =>
                    cat.groups
                        .filter((group) => !!group)
                        .some((group) =>
                            group.data[0].some(
                                (data) => char.currencies?.[data.ids[0]]?.quantity > 0
                            )
                        )
                );
        }

        if (categories[0]?.groups[0]?.lookup === 'race') {
            const charRace = wowthingData.static.characterRaceById.get(char.raceId);
            return categories
                .filter((cat) => !!cat)
                .some((cat) =>
                    cat.groups
                        .filter((group) => !!group)
                        .some((group) => Object.keys(group.data).includes(charRace.slug))
                );
        }

        return true;
    });

    let progress = $derived.by(() => {
        const characters: Character[] = filterFunc
            ? userState.general.visibleCharacters.filter((char) => filterFunc(char))
            : userState.general.visibleCharacters;

        const ret: Record<string, ProgressInfo> = {};
        for (const category of categories.filter((cat) => cat !== null)) {
            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex];
                for (const character of characters) {
                    const data = (ret[`${category.slug}|${groupIndex}|${character.id}`] =
                        getProgress(character, category, group));

                    // Hardcoded hacks for Mage Tower artifact appearances
                    if (group.name === 'Challenge Unlocks' && data.have === 0) {
                        data.total = 0;
                    } else if (group.name === 'Challenge Appearances') {
                        const prev = ret[`${category.slug}|${groupIndex - 1}|${character.id}`];
                        if (prev.have === 0) {
                            data.have = 0;
                            data.total = 0;
                        }
                    }
                }
            }
        }
        return ret;
    });

    let [sorted, sortFunc] = $derived.by(() => {
        const order: string = $progressState.sortOrder[slugKey];
        if (order) {
            return [
                true,
                getCharacterSortFunc((char) => {
                    const data = progress[`${order}|${char.id}`];
                    return leftPad(100 - (data?.total > 0 ? (data?.have ?? 0) : -1), 3, '0');
                }),
            ];
        } else {
            return [false, getCharacterSortFunc()];
        }
    });
</script>

<CharacterTable skipGrouping={sorted} skipIgnored={true} {filterFunc} {sortFunc}>
    <CharacterTableHead slot="head">
        {#key slugKey}
            {#if slug1 === 'shadowlands'}
                <HeadCovenant />
            {/if}

            <th class="spacer"></th>

            {#each categories as category, categoryIndex}
                {#if category === null}
                    <th class="spacer"></th>
                {:else}
                    {#if categoryIndex > 0 && categories[categoryIndex - 1]?.groups?.length > 0}
                        <th class="spacer"></th>
                    {/if}

                    {#each category.groups as group, groupIndex}
                        {#if group.name === 'separator'}
                            <th class="spacer"></th>
                        {:else}
                            <HeadProgress
                                sortKey={`${category.slug}|${groupIndex}`}
                                sortingBy={$progressState.sortOrder[slugKey] ===
                                    `${category.slug}|${groupIndex}`}
                                {group}
                                {slugKey}
                            />
                        {/if}
                    {/each}
                {/if}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slugKey}
            {#if slug1 === 'shadowlands'}
                <RowCovenant {character} />
            {/if}

            <td class="spacer"></td>

            {#each categories as category, categoryIndex}
                {#if category === null}
                    <td class="spacer"></td>
                {:else}
                    {#if categoryIndex > 0 && categories[categoryIndex - 1]?.groups?.length > 0}
                        <td class="spacer"></td>
                    {/if}

                    {#each category.groups as group, groupIndex}
                        {#if group.name === 'separator'}
                            <td class="spacer"></td>
                        {:else if group.type === 'raidSkip'}
                            <RowProgressRaidSkip {character} {group} />
                        {:else}
                            <RowProgress
                                progressData={progress[
                                    `${category.slug}|${groupIndex}|${character.id}`
                                ]}
                                {character}
                                {group}
                            />
                        {/if}
                    {/each}
                {/if}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
