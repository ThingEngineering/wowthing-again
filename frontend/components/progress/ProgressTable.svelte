<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import some from 'lodash/some'

    import { userAchievementStore, userQuestStore, userStore } from '@/stores'
    import { progressState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import getProgress from '@/utils/get-progress'
    import toDigits from '@/utils/to-digits'
    import type { Character } from '@/types'
    import type { StaticDataProgressCategory} from '@/types/data/static'
    import type { ProgressInfo } from '@/utils/get-progress'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadCovenant from '@/components/home/table/head/HomeTableHeadCovenant.svelte'
    import HeadProgress from './ProgressTableHead.svelte'
    import RowCovenant from '@/components/home/table/row/HomeTableRowCovenant.svelte'
    import RowProgress from './ProgressTableBody.svelte'
    import RowProgressRaidSkip from './ProgressTableBodyRaidSkip.svelte'

    export let slug1: string
    export let slug2: string

    let categories: StaticDataProgressCategory[]
    let progress: Record<string, ProgressInfo>
    let filterFunc: (char: Character) => boolean
    let slugKey: string
    let sorted: boolean
    let sortFunc: (char: Character) => string

    $: {
        slugKey = `${slug1}|${slug2}`
    }

    $: {
        categories = find($staticStore.data.progress, (p) => p !== null && p[0].slug === slug1) || []
        if (categories.length === 0) {
            break $
        }

        const firstCategory = categories[0]
        if (slug2) {
            categories = filter(categories, (s) => s !== null && s.slug === slug2)
            if (categories.length === 0) {
                break $
            }
        }

        const minimumLevels = [firstCategory, ...categories]
            .map((cat) => cat.minimumLevel)
            .filter((ml) => (ml || 0) > 0)
        const minimumLevel = minimumLevels.length > 0 ? Math.min(...minimumLevels) : 0

        const requiredQuestIds = firstCategory.requiredQuestIds.concat(categories[0].requiredQuestIds)
        filterFunc = (char: Character) => {
            if (minimumLevel > 0 && char.level < minimumLevel) {
                return false
            }
            if (requiredQuestIds.length > 0 &&
                !some(requiredQuestIds, (id) => $userQuestStore.data.characters[char.id]?.quests?.has(id))) {
                return false
            }
            return true
        }

        const characters: Character[] = filterFunc ?
            $userStore.data.characters.filter((char) => filterFunc(char)) :
            $userStore.data.characters

        progress = {}
        for (const category of categories) {
            if (category === null) {
                continue
            }

            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex]
                for (const character of characters) {
                    progress[`${category.slug}|${groupIndex}|${character.id}`] = getProgress(
                        $userAchievementStore.data,
                        $userQuestStore.data,
                        character,
                        category,
                        group,
                    )
                }
            }
        }
    }

    $: {
        const order: string = $progressState.sortOrder[slugKey]
        if (order) {
            sorted = true
            //sortFunc = (char) => toDigits(1000000 - (char.currencies?.[order]?.quantity ?? -1), 7)
            sortFunc = (char) => {
                const data = progress[`${order}|${char.id}`]
                return toDigits(100 - (data?.total > 0 ? (data?.have ?? 0) : -1), 3)
            }
        }
        else {
            sorted = false
            sortFunc = getCharacterSortFunc($settingsData)
        }
    }
</script>

<style lang="scss">
    .spacer {
        background: $body-background;
        border-bottom-width: 0 !important;
        border-left: 1px solid $border-color;
        border-top-width: 0 !important;
        min-width: 1rem;
        width: 1rem;
    }
</style>

<CharacterTable
    skipGrouping={sorted}
    {filterFunc}
    {sortFunc}
>
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
                    {#if categoryIndex > 0 && categories[categoryIndex-1].groups.length > 0}
                        <th class="spacer"></th>
                    {/if}

                    {#each category.groups as group, groupIndex}
                        {#if group.name === 'separator'}
                            <th class="spacer"></th>
                        {:else}
                            <HeadProgress
                                sortKey={`${category.slug}|${groupIndex}`}
                                sortingBy={$progressState.sortOrder[slugKey] === `${category.slug}|${groupIndex}`}
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
                    {#if categoryIndex > 0 && categories[categoryIndex-1].groups.length > 0}
                        <td class="spacer"></td>
                    {/if}

                    {#each category.groups as group, groupIndex}
                        {#if group.name === 'separator'}
                            <td class="spacer"></td>
                        {:else if group.type === 'raidSkip'}
                            <RowProgressRaidSkip
                                character={character}
                                {group}
                            />
                        {:else}
                            <RowProgress
                                progressData={progress[`${category.slug}|${groupIndex}|${character.id}`]}
                                {group}
                            />
                        {/if}
                    {/each}
                {/if}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
