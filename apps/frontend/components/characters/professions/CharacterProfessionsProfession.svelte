<script lang="ts">
    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { Faction } from '@/enums'
    import { getNameForFaction } from '@/utils/get-name-for-faction'
    import { UserCount, type Character, type CharacterProfession, type Expansion, type MultiSlugParams } from '@/types'
    import type { StaticDataProfession, StaticDataProfessionCategory } from '@/types/data/static'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Table from './CharacterProfessionsProfessionTable.svelte'

    export let character: Character
    export let params: MultiSlugParams
    export let staticProfession: StaticDataProfession

    let charSubProfession: CharacterProfession
    let expansion: Expansion
    let knownRecipes: Set<number>
    let rootCategory: StaticDataProfessionCategory
    let stats: UserCount
    $: {
        expansion = expansionSlugMap[params.slug5]
        if (!expansion || expansion.id < 0 || expansion.id > 99) {
            break $
        }
        
        const charProfession = character.professions[staticProfession.id]
        if (!charProfession) {
            break $
        }
        
        charSubProfession = charProfession[staticProfession.subProfessions[expansion.id].id]
        knownRecipes = new Set<number>()
        for (const subProfession of Object.values(charProfession)) {
            for (const abilityId of subProfession.knownRecipes) {
                knownRecipes.add(abilityId)
            }
        }

        rootCategory = staticProfession.categories?.[Constants.expansion - expansion.id]
        if (rootCategory) {
            while (rootCategory.children.length === 1) {
                rootCategory = rootCategory.children[0]
            }
        }

        stats = new UserCount()
        recurse(rootCategory)
    }

    const recurse = function(category: StaticDataProfessionCategory) {
        for (const ability of (category.abilities || [])) {
            if (ability.faction !== Faction.Neutral && ability.faction !== character.faction) {
                continue
            }

            if (ability.extraRanks) {
                stats.total += (ability.extraRanks.length + 1)

                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    if (knownRecipes.has(ability.extraRanks[rankIndex][0])) {
                        stats.have += (rankIndex + 2)
                        break
                    }
                }
                if (knownRecipes.has(ability.id)) {
                    stats.have++
                }
            }
            else {
                stats.total++
                if (knownRecipes.has(ability.id)) {
                    stats.have++
                }
            }
        }

        for (const child of (category.children || [])) {
            recurse(child)
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
        {#if charSubProfession}
            <div class="professions-container">
                <ProgressBar
                    have={charSubProfession.currentSkill}
                    total={charSubProfession.maxSkill}
                    title={getNameForFaction(staticProfession.subProfessions[expansion.id].name, character.faction)}
                />

                {#if stats.total > 0}
                    <ProgressBar
                        have={stats.have}
                        total={stats.total}
                        title="Known recipes"
                    />
                {/if}
            </div>
        {/if}

        {#if rootCategory}
            <div class="professions-container">
                {#if rootCategory.abilities.length > 0}
                    <Table
                        category={rootCategory}
                        {character}
                        {charSubProfession}
                        {expansion}
                        {knownRecipes}
                    />
                {/if}

                {#each rootCategory.children as child}
                    <Table
                        category={child}
                        {character}
                        {charSubProfession}
                        {expansion}
                        {knownRecipes}
                    />
                {/each}
            </div>
        {/if}
    </div>
{/if}
