<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion';
    import { getNameForFaction } from '@/utils/get-name-for-faction';
    import getPercentClass from '@/utils/get-percent-class';
    import type {
        StaticDataProfession,
        StaticDataProfessionAbility,
        StaticDataProfessionCategory,
        StaticDataSubProfession,
    } from '@/shared/stores/static/types';
    import type {
        Character,
        CharacterSubProfession,
        Expansion,
        MultiSlugParams,
        UserCount,
    } from '@/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Table from './CharacterProfessionsProfessionTable.svelte';
    import ProfessionSpecializationIcon from '@/shared/components/icons/ProfessionSpecializationIcon.svelte';

    export let character: Character;
    export let params: MultiSlugParams;
    export let staticProfession: StaticDataProfession;

    let charSubProfession: CharacterSubProfession;
    let expansion: Expansion;
    let filteredCategories: Record<number, StaticDataProfessionAbility[]>;
    let hasFirstCraft: boolean;
    let knownRecipes: Set<number>;
    let rootCategory: StaticDataProfessionCategory;
    let stats: UserCount;
    let subProfession: StaticDataSubProfession;

    $: {
        expansion = expansionSlugMap[params.slug5];
        const charProfession = character.professions[staticProfession.id];
        if (!expansion || !charProfession) {
            break $;
        }

        subProfession = staticProfession.expansionSubProfession[expansion.id];
        charSubProfession = charProfession?.subProfessions?.[subProfession.id];

        knownRecipes = charProfession?.knownRecipes;
        filteredCategories = charProfession?.filteredCategories || {};
        stats = charProfession?.subProfessionStats?.[subProfession.id];

        rootCategory = staticProfession.expansionCategory?.[expansion.id];
        if (rootCategory) {
            while (rootCategory.children.length === 1) {
                rootCategory = rootCategory.children[0];
            }
        }

        hasFirstCraft = rootCategory.children.some((child) =>
            child.abilities.some((ability) => !!ability.firstCraftQuestId)
        );
    }

    const getProgressClass = (current: number, max: number) => {
        if (current === 0) {
            return 'border-fail';
        } else {
            return `${getPercentClass((current / max) * 100)}-border`;
        }
    };
</script>

<style lang="scss">
    .professions-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
    }
    .professions-container {
        column-count: 2;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;

        :global(button:first-child a) {
            margin-right: 0.2rem;
        }
    }
</style>

{#snippet professionTitle()}
    <ProfessionSpecializationIcon {character} professionId={staticProfession.id} />
    {getNameForFaction(subProfession.name, character.faction)}
{/snippet}

{#if expansion}
    <div class="professions-wrapper">
        <div class="professions-container">
            <ProgressBar
                cls={getProgressClass(
                    charSubProfession?.skillCurrent || 0,
                    charSubProfession?.skillMax || 1
                )}
                have={charSubProfession?.skillCurrent || 0}
                total={charSubProfession?.skillMax || -1}
                title={professionTitle}
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

                {#each rootCategory.children as child (child)}
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
