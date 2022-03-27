<script lang="ts">
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

    export let slug: string

    let categories: StaticDataProgressCategory[]
    let progress: Record<string, ProgressInfo>
    let filterFunc: (char: Character) => boolean
    let sorted: boolean
    let sortFunc: (char: Character) => string
    $: {
        categories = find($staticStore.data.progress, (p) => p !== null && p[0].slug === slug)

        if (categories[0].requiredQuestIds.length > 0) {
            filterFunc = (char: Character) => some(
                categories[0].requiredQuestIds,
                (id) => $userQuestStore.data.characters[char.id]?.quests?.has(id)
            )
        }
        else {
            filterFunc = null
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
        const order: string = $progressState.sortOrder[slug]
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
        width: 1rem;
    }
</style>

<CharacterTable
    skipGrouping={sorted}
    {filterFunc}
    {sortFunc}
>
    <CharacterTableHead slot="head">
        {#key slug}
            {#if slug === 'shadowlands'}
                <HeadCovenant />
            {/if}

            <th class="spacer"></th>

            {#each categories as category}
                {#if category === null}
                    <th class="spacer"></th>
                {:else}
                    {#each category.groups as group, groupIndex}
                        <HeadProgress
                            sortKey={`${category.slug}|${groupIndex}`}
                            sortingBy={$progressState.sortOrder[slug] === `${category.slug}|${groupIndex}`}
                            {group}
                            {slug}
                        />
                    {/each}
                {/if}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#if slug === 'shadowlands'}
                <RowCovenant {character} />
            {/if}

            <td class="spacer"></td>

            {#each categories as category}
                {#if category === null}
                    <td class="spacer"></td>
                {:else}
                    {#each category.groups as group, groupIndex}
                        <RowProgress
                            progressData={progress[`${category.slug}|${groupIndex}|${character.id}`]}
                            {group}
                        />
                    {/each}
                {/if}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
