<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion'
    import { professionSlugToId } from '@/data/professions'
    import { staticStore } from '@/shared/stores/static'
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { lazyStore, userStore } from '@/stores'
    import { UserCount } from '@/types'
    import getPercentClass from '@/utils/get-percent-class';
    import type { StaticDataProfessionCategory } from '@/shared/stores/static/types'

    import { recipesState } from './state'

    import Ability from './Ability.svelte'
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import Options from './Options.svelte'

    export let expansionSlug: string
    export let professionSlug: string

    // let allKnown: Set<number>
    let category: StaticDataProfessionCategory
    let subCategories: [StaticDataProfessionCategory, UserCount][]
    $: {
        const expansionId = expansionSlugMap[expansionSlug].id;
        const professionId = professionSlugToId[professionSlug];

        const profession = $staticStore.professions[professionId]
        const subProfessionId = profession.expansionSubProfession[expansionId].id

        category = profession.expansionCategory[expansionId].children[0]
        subCategories = []
        for (const subCategory of category.children) {
            if (subCategory.abilities.length === 0) { continue }

            const subStats = $lazyStore.recipes.stats[`${professionSlug}--${expansionSlug}--${subCategory.id}`]

            let anyShown = false
            for (const ability of subCategory.abilities) {
                const abilityIds = [
                    ability.id,
                    ...(ability.extraRanks || []).map(([abilityId,]) => abilityId)
                ]

                const abilityUserHas = $lazyStore.recipes.hasAbility[ability.id];
                abilityIds.forEach((_abilityId, index) => {
                    const userHas = abilityUserHas[index];
                    if (
                        (userHas && $recipesState.showCollected) ||
                        (!userHas && $recipesState.showUncollected)
                    ) {
                        anyShown = true
                        return
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
        width: calc(20rem + 22px);
    }
    th {
        padding: 0.15rem 0.3rem;
    }
</style>

<Options {category} {expansionSlug} {professionSlug} />

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
                        use:basicTooltip={`Category ${subCategory.id}`}
                    >
                        <div class="flex-wrapper">
                            <span class="text-overflow">
                                {subCategory.name}
                            </span>
                            <CollectibleCount counts={subStats} />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each subCategory.abilities as ability}
                    <Ability
                        rank={1}
                        {ability}
                    />

                    {#each (ability.extraRanks || []) as _, rankIndex}
                        <Ability
                            rank={rankIndex + 2}
                            {ability}
                        />
                    {/each}
                {/each}
            </tbody>
        </table>
    {/each}
</div>
