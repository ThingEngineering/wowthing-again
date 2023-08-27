<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { Constants } from '@/data/constants'
    import { iconStrings } from '@/data/icons'
    import { itemStore, staticStore, userStore } from '@/stores'
    import { professionsRecipesState } from '@/stores/local-storage'
    import type { Character, Expansion } from '@/types'
    import type {
        StaticDataProfession,
        StaticDataProfessionAbility,
        StaticDataProfessionCategory,
        StaticDataSubProfession
    } from '@/types/data/static'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte';
    import ProfessionIcon from '@/components/images/ProfessionIcon.svelte';

    export let expansion: Expansion
    export let profession: StaticDataProfession

    let categoryChildren: StaticDataProfessionCategory[]
    let characters: Character[]
    let colspan: number
    let subProfession: StaticDataSubProfession
    $: {
        categoryChildren = profession.categories[Constants.expansion - expansion.id]
            .children[0]
            .children
            .filter((cat) => cat.abilities.length > 0)
        subProfession = profession.subProfessions[expansion.id]
        
        characters = $userStore.characters.filter((char) =>
            char.professions?.[profession.id]?.[subProfession.id]
        )
        characters.sort((a, b) => a.name.localeCompare(b.name))

        colspan = 2 + characters.length
    }

    const getAbilities = (abilities: StaticDataProfessionAbility[], includeTrainerRecipes: boolean) => {
        return sortBy(
            abilities.filter((ability) =>
                includeTrainerRecipes ||
                !!$staticStore.skillLineAbilityItems[ability.id]
            ),
            (ability) => {
                const hasItems = !!$staticStore.skillLineAbilityItems[ability.id]
                if (ability.itemId) {
                    const item = $itemStore.items[ability.itemId]
                    return `${hasItems ? 0 : 1}|${9 - item.quality}|${item.name}`
                }
                else {
                    return `${hasItems ? 0 : 1}|9|${ability.name}`
                }
            }
        )
    }
</script>

<style lang="scss">
    th {
        font-weight: normal;
        top: 3.35rem;

        &:first-child {
            text-align: left;
        }
    }
    .spacer {
        td {
            background: $body-background !important;
            border-left-width: 0 !important;
            border-right-width: 0 !important;
        }
    }
    .character-icon {
        border-left: 1px solid $border-color;
        padding: 0.2rem 0.3rem;

        div {
            --image-border-width: 2px;

            position: relative;
        }

        .pill {
            bottom: 0;
        }
    }
    td {
        padding-left: 0.4rem;
        padding-right: 0.4rem;
    }
    // .category {
    // }
    .source {
        padding-right: 0;
    }
    // .name {
    // }
    .status {
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

<table class="table table-striped character-table">
    <thead>
        <tr>
            <th colspan="2">
                <Checkbox
                    name="include_trainer_recipes"
                    bind:value={$professionsRecipesState.includeTrainerRecipes}
                >Include trainer recipes</Checkbox>
            </th>
            {#each characters as character}
                <th class="character-icon">
                    <div>
                        <ClassIcon
                            {character}
                            border={2}
                            size={40}
                        />
                        <span class="pill abs-center">{character.name.slice(0, 5)}</span>
                    </div>
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each categoryChildren as category, categoryIndex}
            {@const abilities = getAbilities(category.abilities, $professionsRecipesState.includeTrainerRecipes)}
            {#if abilities.length > 0}
                <tr class="spacer">
                    <td colspan="{colspan}">&nbsp;</td>
                </tr>

                <tr>
                    <td class="category" colspan="{colspan}">
                        {category.name}
                    </td>
                </tr>

                {#each abilities as ability}
                    {@const recipes = $staticStore.skillLineAbilityItems[ability.id]}
                    <tr data-id={ability.id}>
                        <td class="source">
                            {#if recipes}
                                {@const recipeItem = $itemStore.items[recipes[0]]}
                                <span class="quality{recipeItem?.quality ?? 1}">
                                    <WowheadLink
                                        type="item"
                                        id={recipes[0]}
                                    >
                                        <WowthingImage
                                            name="item/{recipes[0]}"
                                            size={20}
                                        />
                                    </WowheadLink>
                                </span>
                            {:else}
                                <ProfessionIcon id={profession.id} />
                            {/if}
                        </td>
                        <td
                            class="name {ability.itemId ? `quality${$itemStore.items[ability.itemId].quality}` : undefined}"
                        >
                            <WowheadLink
                                type="spell"
                                id={ability.spellId}
                            >
                                {ability.name}
                            </WowheadLink>
                        </td>

                        {#each characters as character}
                            {@const charProf = character.professions[profession.id][subProfession.id]}
                            {@const charHas = charProf.knownRecipes.indexOf(ability.id) >= 0}
                            <td
                                class="status"
                                class:status-success={charHas}
                                class:status-fail={!charHas}
                            >
                                <IconifyIcon
                                    icon={charHas ? iconStrings.yes : iconStrings.no}
                                />
                            </td>
                        {/each}
                    </tr>
                {/each}
            {/if}
        {/each}
    </tbody>
</table>