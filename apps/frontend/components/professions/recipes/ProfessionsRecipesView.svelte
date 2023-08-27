<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { Constants } from '@/data/constants'
    import { iconStrings } from '@/data/icons'
    import { itemStore, userStore } from '@/stores'
    import type { Character, Expansion } from '@/types'
    import type {
        StaticDataProfession,
        StaticDataProfessionAbility,
        StaticDataProfessionCategory,
        StaticDataSubProfession
    } from '@/types/data/static'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'

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

        colspan = 1 + characters.length
    }

    const sortAbilities = (abilities: StaticDataProfessionAbility[]) => {
        return sortBy(
            abilities,
            (ability) => {
                if (ability.itemId) {
                    const item = $itemStore.items[ability.itemId]
                    return `${9 - item.quality}${item.name}`
                }
                else {
                    return `9${ability.name}`
                }
            }
        )
    }
</script>

<style lang="scss">
    th {
        top: 3.35rem;
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
            <th>&nbsp;</th>
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
            {@const abilities = sortAbilities(category.abilities)}
            
            {#if categoryIndex > 0}
                <tr class="spacer">
                    <td colspan="{colspan}">&nbsp;</td>
                </tr>
            {/if}

            <tr>
                <td class="category" colspan="{colspan}">
                    {category.name}
                </td>
            </tr>

            {#each abilities as ability}
                <tr>
                    <td class="name" data-id={ability.id}>
                        {#if ability.itemId}
                            <ParsedText text={`{item:${ability.itemId}}`} />
                        {:else}
                            {ability.name}
                        {/if}
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
        {/each}
    </tbody>
</table>
