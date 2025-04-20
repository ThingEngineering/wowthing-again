<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { BindType } from '@/enums/bind-type';
    import { Faction } from '@/enums/faction';
    import { SkillSourceType } from '@/enums/skill-source-type';
    import { iconLibrary } from '@/shared/icons';
    import { settingsStore } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import { itemStore, lazyStore, userQuestStore, userStore } from '@/stores';
    import { newNavState, professionsRecipesState } from '@/stores/local-storage';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { useCharacterFilter } from '@/utils/characters';
    import type { Character, Expansion } from '@/types';
    import type {
        StaticDataProfession,
        StaticDataProfessionCategory,
        StaticDataSubProfession,
    } from '@/shared/stores/static/types';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    export let expansion: Expansion;
    export let profession: StaticDataProfession;

    let categoryChildren: StaticDataProfessionCategory[];
    let characters: Character[];
    let colspan: number;
    let subProfession: StaticDataSubProfession;
    $: {
        categoryChildren = profession.expansionCategory[expansion.id].children[0].children.filter(
            (cat) => cat.abilities.length > 0,
        );
        subProfession = profession.expansionSubProfession[expansion.id];

        characters = [];
        const collectorIds =
            $settingsStore.professions.collectingCharactersV2?.[profession.id] || [];
        if (collectorIds.length > 0) {
            characters.push(null);
            characters.push(
                ...collectorIds.map((collectorId) => $userStore.characterMap[collectorId]),
            );
        }

        const professionCharacters = $userStore.characters.filter((char) =>
            useCharacterFilter(
                $lazyStore,
                $settingsStore,
                $userQuestStore,
                (c) =>
                    !collectorIds.includes(c.id) &&
                    !!c.professions?.[profession.id]?.[subProfession.id],
                char,
                $newNavState.characterFilter,
            ),
        );
        if (professionCharacters.length > 0) {
            characters.push(null);

            professionCharacters.sort((a, b) => {
                if (a.level !== b.level) {
                    return b.level - a.level;
                }
                return a.name.localeCompare(b.name);
            });
            characters.push(...professionCharacters);
        }

        colspan = 3 + characters.length;
    }

    const getAbilities = (
        category: StaticDataProfessionCategory,
        includeTrainerRecipes: boolean,
    ) => {
        const filteredAbilities = category.abilities.filter(
            (ability) =>
                includeTrainerRecipes ||
                (ability.source !== SkillSourceType.Trainer &&
                    ability.source !== SkillSourceType.Discovery &&
                    !!$staticStore.skillLineAbilityItems[ability.id]),
        );
        return sortBy(filteredAbilities, (ability) => {
            const hasItems = !!$staticStore.skillLineAbilityItems[ability.id];
            const item = $itemStore.items[ability.itemIds[0] || 0];
            return [
                hasItems ? 0 : 1,
                ability.itemIds[0] ? 9 - item.quality : 9,
                category.id === 1871 ? getCrestOrder(ability.spellId) : 0,
                // item?.name || ability.name
            ].join('|');
        });
    };

    const getCrestOrder = (spellId: number): number => {
        if ([429945, 429947, 429948].includes(spellId)) {
            return 0;
        } else if ([414985, 414988, 414989].includes(spellId)) {
            return 1;
        } else if ([406108, 406413, 406418].includes(spellId)) {
            return 2;
        }
        return 999;
    };
</script>

<style lang="scss">
    th {
        font-weight: normal;
        top: var(--sticky-top);

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
            <th colspan="3">
                <Checkbox
                    name="include_trainer_recipes"
                    bind:value={$professionsRecipesState.includeTrainerRecipes}
                    >Include discovered/trainer recipes</Checkbox
                >
            </th>
            {#each characters as character}
                {#if character !== null}
                    <th class="character-icon">
                        <div>
                            <ClassIcon {character} border={2} size={40} />
                            <span class="pill abs-center">{character.name.slice(0, 5)}</span>
                        </div>
                    </th>
                {:else}
                    <th class="spacer"></th>
                {/if}
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each categoryChildren as category}
            {@const abilities = getAbilities(
                category,
                $professionsRecipesState.includeTrainerRecipes,
            )}
            {#if abilities.length > 0}
                <tr class="spacer">
                    <td {colspan}>&nbsp;</td>
                </tr>

                <tr>
                    <td class="category" {colspan}>
                        {category.name}
                    </td>
                </tr>

                {#each abilities as ability}
                    {@const recipes = $staticStore.skillLineAbilityItems[ability.id]}
                    {@const recipeItem = $itemStore.items[recipes?.[0]]}
                    <tr data-id={ability.id}>
                        <td class="source">
                            {#if recipeItem}
                                <span class="quality{recipeItem.quality ?? 1}">
                                    <WowheadLink type="item" id={recipeItem.id}>
                                        <WowthingImage name="item/{recipeItem.id}" size={20} />

                                        {#if recipeItem.allianceOnly}
                                            <FactionIcon faction={Faction.Alliance} />
                                        {:else if recipeItem.hordeOnly}
                                            <FactionIcon faction={Faction.Horde} />
                                        {/if}
                                    </WowheadLink>
                                </span>
                            {:else}
                                <ProfessionIcon id={profession.id} />
                            {/if}
                        </td>
                        <td
                            class="name {ability.itemIds[0]
                                ? `quality${$itemStore.items[ability.itemIds[0]].quality}`
                                : undefined}"
                        >
                            <WowheadLink type="spell" id={ability.spellId}>
                                {#if ability.name}
                                    {ability.name}
                                {:else}
                                    {$itemStore.items[ability.itemIds[0] || 0]?.name}
                                {/if}
                            </WowheadLink>
                        </td>
                        <td class="auctions">
                            {#if recipes && recipes.some((id) => $itemStore.items[id]?.bindType !== BindType.OnAcquire)}
                                <a
                                    href="#/auctions/specific-item/{recipes[0]}"
                                    target="_blank"
                                    use:basicTooltip={'Find auctions'}
                                >
                                    <IconifyIcon icon={iconLibrary.mdiBank} />
                                </a>
                            {/if}
                        </td>

                        {#each characters as character}
                            {#if character === null}
                                <td class="spacer"></td>
                            {:else}
                                {@const charProf =
                                    character.professions[profession.id][subProfession.id]}
                                {@const charHas = charProf?.knownRecipes?.indexOf(ability.id) >= 0}
                                <td
                                    class="status"
                                    class:status-success={charHas}
                                    class:status-fail={!charHas}
                                >
                                    <YesNoIcon state={charHas} />
                                </td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
            {/if}
        {/each}
    </tbody>
</table>
