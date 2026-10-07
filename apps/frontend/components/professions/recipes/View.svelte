<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { SkillSourceType } from '@/enums/skill-source-type';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { newNavState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import { useCharacterFilter } from '@/utils/characters';
    import type { Character, ExpansionData } from '@/types';
    import type {
        StaticDataProfession,
        StaticDataProfessionCategory,
    } from '@/shared/stores/static/types';

    import AbilityRow from './AbilityRow.svelte';
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';

    type Props = {
        expansion: ExpansionData;
        profession: StaticDataProfession;
    };

    let { expansion, profession }: Props = $props();

    let categoryChildren = $derived(
        profession.expansionCategory[expansion.id].children[0].children.filter(
            (cat) => cat.abilities.length > 0
        )
    );
    let subProfession = $derived(profession.expansionSubProfession[expansion.id]);

    let characters = $derived.by(() => {
        const ret: Character[] = [];

        const collectorIds =
            settingsState.value.professions.collectingCharactersV2?.[profession.id] || [];
        const validCollectors = collectorIds
            .map((collectorId) => userState.general.characterById[collectorId])
            .filter((char) => !!char);
        if (validCollectors.length > 0) {
            ret.push(null);
            ret.push(...validCollectors);
        }

        if (!browserState.current.professions.recipesOnlyCollectors) {
            const professionCharacters = userState.general.visibleCharacters.filter((char) =>
                useCharacterFilter(
                    settingsState.value,
                    (c) =>
                        !collectorIds.includes(c.id) &&
                        !!c.professions?.[profession.id]?.subProfessions?.[subProfession.id],
                    char,
                    $newNavState.characterFilter
                )
            );
            if (professionCharacters.length > 0) {
                ret.push(null);

                professionCharacters.sort((a, b) => {
                    if (a.level !== b.level) {
                        return b.level - a.level;
                    }
                    return a.name.localeCompare(b.name);
                });
                ret.push(...professionCharacters);
            }
        }

        return ret;
    });

    let colspan = $derived(characters.length + 3);

    const getAbilities = (
        category: StaticDataProfessionCategory,
        includeTrainerRecipes: boolean
    ) => {
        const filteredAbilities = category.abilities.filter(
            (ability) =>
                includeTrainerRecipes ||
                (ability.source !== SkillSourceType.Trainer &&
                    ability.source !== SkillSourceType.Discovery &&
                    !!wowthingData.static.skillLineAbilityItems[ability.id])
        );
        return sortBy(filteredAbilities, (ability) => {
            const hasItems = !!wowthingData.static.skillLineAbilityItems[ability.id];
            const item = wowthingData.items.items[ability.itemIds[0] || 0];
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
            background: var(--color-body-background) !important;
            border-left-width: 0 !important;
            border-right-width: 0 !important;
        }
    }
    .character-icon {
        border-left: 1px solid var(--border-color);
        padding: 0.2rem 0.3rem;

        div {
            --image-border-width: 2px;

            position: relative;
        }

        .pill {
            bottom: 0;
            pointer-events: none;
        }
    }
    td {
        padding-left: 0.4rem;
        padding-right: 0.4rem;
    }
    .source {
        --width: calc(23px + 0.4rem);

        padding-right: 0;
    }
    .name {
        --width: 22rem;

        max-width: 22rem;
    }
</style>

<table class="table table-striped character-table">
    <thead>
        <tr>
            <th colspan="3">
                <Checkbox
                    name="include_trainer_recipes"
                    bind:value={browserState.current.professions.recipesIncludeTrainer}
                    >Include discovered/trainer recipes</Checkbox
                >
                <Checkbox
                    name="only_collectors"
                    bind:value={browserState.current.professions.recipesOnlyCollectors}
                    >Only collectors</Checkbox
                >
            </th>
            {#each characters as character}
                {#if character}
                    <th class="character-icon">
                        <div class="faction{character.faction}">
                            <ClassIcon
                                {character}
                                border={2}
                                size={40}
                                tooltip={`${character.name}-${character.realm?.name ?? 'UNKNOWN'}`}
                            />
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
        {#each categoryChildren as category (category.id)}
            {@const abilities = getAbilities(
                category,
                browserState.current.professions.recipesIncludeTrainer
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

                {#each abilities as ability (ability.id)}
                    <AbilityRow {ability} {characters} {profession} {subProfession} />
                {/each}
            {/if}
        {/each}
    </tbody>
</table>
