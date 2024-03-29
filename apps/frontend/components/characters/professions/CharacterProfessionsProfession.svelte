<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion'
    import { lazyStore } from '@/stores'
    import { getNameForFaction } from '@/utils/get-name-for-faction'
    import type { StaticDataProfession, StaticDataProfessionAbility, StaticDataProfessionCategory } from '@/shared/stores/static/types'
    import type { Character, CharacterProfession, Expansion, MultiSlugParams, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Table from './CharacterProfessionsProfessionTable.svelte'
    import getPercentClass from '@/utils/get-percent-class';

    export let character: Character
    export let params: MultiSlugParams
    export let staticProfession: StaticDataProfession

    let charSubProfession: CharacterProfession
    let expansion: Expansion
    let filteredCategories: Record<number, StaticDataProfessionAbility[]>
    let knownRecipes: Set<number>
    let rootCategory: StaticDataProfessionCategory
    let stats: UserCount

    $: {
        expansion = expansionSlugMap[params.slug5]
        const charProfession = character.professions[staticProfession.id]
        if (!expansion || !charProfession) {
            break $
        }

        const subProfessionId = staticProfession.subProfessions[expansion.id].id
        charSubProfession = charProfession[subProfessionId]

        const lazyProfessions = $lazyStore.characters[character.id].professions
        knownRecipes = lazyProfessions.knownRecipes

        const lazyProfession = lazyProfessions.professions[staticProfession.id]
        filteredCategories = lazyProfession.filteredCategories
        stats = lazyProfession.subProfessions[subProfessionId]?.stats

        rootCategory = staticProfession.categories?.[expansion.id]
        if (rootCategory) {
            while (rootCategory.children.length === 1) {
                rootCategory = rootCategory.children[0]
            }
        }
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
                title={getNameForFaction(staticProfession.subProfessions[expansion.id].name, character.faction)}
            />

            {#if stats.total > 0}
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
                        {expansion}
                        {filteredCategories}
                        {knownRecipes}
                    />
                {/if}

                {#each rootCategory.children as child}
                    <Table
                        category={child}
                        {character}
                        {charSubProfession}
                        {expansion}
                        {filteredCategories}
                        {knownRecipes}
                    />
                {/each}
            </div>
        {/if}
    </div>
{/if}
