<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion'
    import { lazyStore } from '@/stores'
    import { getNameForFaction } from '@/utils/get-name-for-faction'
    import getPercentClass from '@/utils/get-percent-class';
    import type { StaticDataProfession, StaticDataProfessionAbility, StaticDataProfessionCategory, StaticDataSubProfession } from '@/shared/stores/static/types'
    import type { Character, CharacterProfession, Expansion, MultiSlugParams, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Table from './CharacterProfessionsProfessionTable.svelte'

    export let character: Character
    export let params: MultiSlugParams
    export let staticProfession: StaticDataProfession

    let charSubProfession: CharacterProfession
    let expansion: Expansion
    let filteredCategories: Record<number, StaticDataProfessionAbility[]>
    let hasFirstCraft: boolean
    let knownRecipes: Set<number>
    let rootCategory: StaticDataProfessionCategory
    let stats: UserCount
    let subProfession: StaticDataSubProfession

    $: {
        expansion = expansionSlugMap[params.slug5]
        const charProfession = character.professions[staticProfession.id]
        if (!expansion || !charProfession) {
            break $
        }

        subProfession = staticProfession.expansionSubProfession[expansion.id]
        charSubProfession = charProfession[subProfession.id]

        const lazyProfessions = $lazyStore.characters[character.id].professions
        knownRecipes = lazyProfessions.knownRecipes

        const lazyProfession = lazyProfessions.professions[staticProfession.id]
        filteredCategories = lazyProfession?.filteredCategories || {}
        stats = lazyProfession?.subProfessions[subProfession.id]?.stats

        rootCategory = staticProfession.expansionCategory?.[expansion.id]
        if (rootCategory) {
            while (rootCategory.children.length === 1) {
                rootCategory = rootCategory.children[0]
            }
        }

        hasFirstCraft = rootCategory.children.some(
            (child) => child.abilities.some(
                (ability) => !!ability.firstCraftQuestId
            )
        )
    }

    const getProgressClass = (current: number, max: number) => {
        if (current === 0) {
            return 'border-fail'
        }
        else {
            return `${getPercentClass(current / max * 100)}-border`
        }
    }
</script>

<style lang="scss">
    .professions-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    .professions-container {
        column-count: 2;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
    }
</style>

{#if expansion}
    <div class="professions-wrapper">
        <div
            class="professions-container"
        >
            <ProgressBar
                cls={getProgressClass(charSubProfession?.currentSkill || 0, charSubProfession?.maxSkill || 1)}
                have={charSubProfession?.currentSkill || 0}
                total={charSubProfession?.maxSkill || -1}
                title={getNameForFaction(subProfession.name, character.faction)}
            />

            {#if stats?.total > 0}
                <ProgressBar
                    cls={getProgressClass(stats.have, stats.total)}
                    have={stats.have}
                    total={stats.total}
                    title="Known recipes"
                />
            {/if}
        </div>

        {#if rootCategory}
            <div class="professions-container">
                {#if rootCategory.abilities.length > 0}
                    <Table
                        category={rootCategory}
                        {character}
                        {charSubProfession}
                        {filteredCategories}
                        {hasFirstCraft}
                        {knownRecipes}
                    />
                {/if}

                {#each rootCategory.children as child}
                    <Table
                        category={child}
                        {character}
                        {charSubProfession}
                        {filteredCategories}
                        {hasFirstCraft}
                        {knownRecipes}
                    />
                {/each}
            </div>
        {/if}
    </div>
{/if}
