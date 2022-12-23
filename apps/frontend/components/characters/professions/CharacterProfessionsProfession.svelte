<script lang="ts">
    import find from 'lodash/find'

    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { staticStore } from '@/stores'
    import type { Character, MultiSlugParams } from '@/types'
    import type { StaticDataProfessionCategory } from '@/types/data/static'

    import Table from './CharacterProfessionsProfessionTable.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let params: MultiSlugParams

    let knownRecipes: Set<number>
    let rootCategory: StaticDataProfessionCategory
    $: {
        const expansion = expansionSlugMap[params.slug5]
        const staticProfession = find($staticStore.data.professions, (prof) => prof.slug === params.slug4)
        
        const charProfession = character.professions[staticProfession.id]
        knownRecipes = new Set<number>()
        for (const subProfession of Object.values(charProfession)) {
            for (const abilityId of subProfession.knownRecipes) {
                knownRecipes.add(abilityId)
            }
        }
        console.log({staticProfession, charProfession, knownRecipes})

        rootCategory = staticProfession.categories?.[Constants.expansion - expansion.id]
        if (rootCategory) {
            while (rootCategory.children.length === 1) {
                rootCategory = rootCategory.children[0]
            }
        }
    }
</script>

<style lang="scss">
    .professions-container {
        column-count: 2;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
    }
</style>

{#if rootCategory}
    <div class="professions-container">
        {#if rootCategory.abilities.length > 0}
            <Table
                category={rootCategory}
                {knownRecipes}
            />
        {/if}

        {#each rootCategory.children as child}
            <Table
                category={child}
                {knownRecipes}
            />
        {/each}
    </div>
{/if}
