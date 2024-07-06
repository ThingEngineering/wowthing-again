<script lang="ts">
    import { Constants } from '@/data/constants'
    import { expansionOrderMap, expansionSlugMap } from '@/data/expansion'
    import { professionSlugToId } from '@/data/professions'
    import { staticStore } from '@/shared/stores/static'
    import { userStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class';
    import { UserCount, type MultiSlugParams } from '@/types'
    import type { StaticDataProfessionCategory } from '@/shared/stores/static/types'

    import { recipesState } from './state'

    import Ability from './Ability.svelte'
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';

    export let params: MultiSlugParams

    let allKnown: Set<number>
    let category: StaticDataProfessionCategory
    let subCategories: [StaticDataProfessionCategory, UserCount][]
    $: {
        const professionId = professionSlugToId[params.slug1]
        const profession = $staticStore.professions[professionId]
        const categoryIndex = expansionOrderMap[expansionSlugMap[params.slug2].id]
        const subProfessionId = profession.subProfessions[Constants.expansion - categoryIndex].id
        category = profession.categories[Constants.expansion - categoryIndex].children[0]
        
        allKnown = new Set<number>()
        for (const character of $userStore.characters) {
            const subProfession = character.professions?.[professionId]?.[subProfessionId]
            if (!subProfession) { continue }

            for (const recipeId of subProfession.knownRecipes || []) {
                allKnown.add(recipeId)
            }
        }

        subCategories = []
        for (const subCategory of category.children) {
            if (subCategory.abilities.length === 0) { continue }

            const subStats = new UserCount()

            let anyShown = false
            for (const ability of subCategory.abilities) {
                const abilityIds = [
                    ability.id,
                    ...(ability.extraRanks || []).map(([abilityId,]) => abilityId)
                ]

                abilityIds.forEach((_abilityId, index) => {
                    subStats.total++
                    const userHas = abilityIds.slice(index)
                        .some((abilityId) => allKnown.has(abilityId))

                    if (userHas) {
                        subStats.have++
                    }

                    if (
                        (userHas && $recipesState.showCollected) ||
                        (!userHas && $recipesState.showUncollected)
                    ) {
                        anyShown = true
                        // break
                    }
                })
            }

            if (anyShown) {
                subCategories.push([subCategory, subStats])
            }
        }
    }
</script>

<style lang="scss">
    .wrapper {
        columns: 4;
    }
    table {
        --image-margin-top: -6px;

        break-inside: avoid;
        margin-bottom: 1rem;
        overflow: hidden; /* Firefox fix */
        table-layout: auto;
        width: 22.3rem;
    }
    th {
        padding: 0.15rem 0.3rem;
    }
</style>

<div class="wrapper">
    {#each subCategories as [subCategory, subStats]}
        <table
            class="table table-striped"
            data-id="{subCategory.id}"
        >
            <thead>
                <tr>
                    <th
                        class="{getPercentClass(subStats.percent)}"
                        colspan="2"
                    >
                        <div class="flex-wrapper">
                            {subCategory.name}
                            <CollectibleCount counts={subStats} />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each subCategory.abilities as ability}
                    <Ability
                        rank={ability.extraRanks?.length > 0 ? 1 : 0}
                        {ability}
                        {allKnown}
                    />

                    {#each (ability.extraRanks || []) as _, rankIndex}
                        <Ability
                            rank={rankIndex + 2}
                            {ability}
                            {allKnown}
                        />
                    {/each}
                {/each}
            </tbody>
        </table>
    {/each}
</div>
