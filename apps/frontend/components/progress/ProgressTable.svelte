<script lang="ts">
    import find from 'lodash/find'

    import { userAchievementStore, userQuestStore, userStore } from '@/stores'
    import { progressState } from '@/stores/local-storage'
    import { manualStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { settingsStore } from '@/shared/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import getProgress from '@/utils/get-progress'
    import { leftPad } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { ManualDataProgressCategory} from '@/types/data/manual'
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

    let categories: ManualDataProgressCategory[]
    let progress: Record<string, ProgressInfo>
    let filterFunc: (char: Character) => boolean
    let sorted: boolean
    let sortFunc: (char: Character) => string

    $: slugKey = `${slug1}|${slug2}`

    $: {
        categories = find($manualStore.progressSets, (p) => p !== null && p[0].slug === slug1) || []
        if (categories.length === 0) {
            break $
        }

        const firstCategory = categories[0]
        if (slug2) {
            categories = categories.filter((s) => s !== null && s.slug === slug2)
            if (categories.length === 0) {
                break $
            }
        }

        const minimumLevels = [firstCategory, ...categories]
            .map((cat) => cat?.minimumLevel || 0)
            .filter((ml) => (ml || 0) > 0)
        const minimumLevel = minimumLevels.length > 0 ? Math.min(...minimumLevels) : 0

        const requiredQuestIds = firstCategory.requiredQuestIds.concat(categories[0].requiredQuestIds)
        filterFunc = (char: Character) => {
            if (minimumLevel > 0 && char.level < minimumLevel) {
                return false
            }

            if (requiredQuestIds.length > 0 &&
                !requiredQuestIds.some((id) => $userQuestStore.characters[char.id]?.quests?.has(id))) {
                return false
            }

            if (categories[0]?.groups[0]?.type === 'dragon-racing' ||
                categories[1]?.groups[0]?.type === 'dragon-racing') {
                return categories.filter((cat) => !!cat).some(
                    (cat) => cat.groups.filter((group) => !!group).some(
                        (group) => group.data[0].some(
                            (data) => char.currencies?.[data.ids[0]]?.quantity > 0
                        )
                    )
                )
            }

            return true
        }

        const characters: Character[] = filterFunc ?
            $userStore.characters.filter((char) => filterFunc(char)) :
            $userStore.characters

        progress = {}
        for (const category of categories.filter((cat) => cat !== null)) {
            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex]
                for (const character of characters) {
                    const data = progress[`${category.slug}|${groupIndex}|${character.id}`] = getProgress(
                        $staticStore,
                        $userStore,
                        $userAchievementStore,
                        $userQuestStore,
                        character,
                        category,
                        group,
                    )

                    // Hardcoded hacks for Mage Tower artifact appearances
                    if (group.name === 'Challenge Unlocks' && data.have === 0) {
                        data.total = 0
                    }
                    else if (group.name === 'Challenge Appearances') {
                        const prev = progress[`${category.slug}|${groupIndex - 1}|${character.id}`]
                        if (prev.have === 0) {
                            data.have = 0
                            data.total = 0
                        }
                    }
                }
            }
        }
    }

    $: {
        const order: string = $progressState.sortOrder[slugKey]
        if (order) {
            sorted = true
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore, (char) => {
                const data = progress[`${order}|${char.id}`]
                return leftPad(100 - (data?.total > 0 ? (data?.have ?? 0) : -1), 3, '0')
            })
        }
        else {
            sorted = false
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore)
        }
    }
</script>

<CharacterTable
    skipGrouping={sorted}
    skipIgnored={true}
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
                    {#if categoryIndex > 0 && categories[categoryIndex-1]?.groups?.length > 0}
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
                    {#if categoryIndex > 0 && categories[categoryIndex-1]?.groups?.length > 0}
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
