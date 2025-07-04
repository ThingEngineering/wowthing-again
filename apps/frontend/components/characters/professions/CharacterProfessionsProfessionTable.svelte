<script lang="ts">
    import { professionSpecializationSpells } from '@/data/professions';
    import { Faction } from '@/enums/faction';
    import { uiIcons } from '@/shared/icons';
    import { wowthingData } from '@/shared/stores/data';
    import { charactersState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import type {
        StaticDataProfessionAbility,
        StaticDataProfessionCategory,
    } from '@/shared/stores/static/types';
    import type { Character, CharacterSubProfession } from '@/types';

    import CraftLevels from './CharacterProfessionsProfessionCraftLevels.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import SkillRanks from './CharacterProfessionsProfessionSkillRanks.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let category: StaticDataProfessionCategory;
    export let character: Character;
    export let charSubProfession: CharacterSubProfession;
    export let filteredCategories: Record<number, StaticDataProfessionAbility[]>;
    export let hasFirstCraft: boolean;
    export let knownRecipes: Set<number>;

    let abilities: [StaticDataProfessionAbility, boolean, number, number, number, number][];
    let hasRanks: boolean;
    $: {
        abilities = [];
        hasRanks = false;
        for (const ability of filteredCategories[category.id] || []) {
            let requiredAbility = wowthingData.static.itemToRequiredAbility[ability.itemIds[0]];
            if (!professionSpecializationSpells[requiredAbility]) {
                requiredAbility = 0;
            }

            let has = false;
            let spellId = ability.spellId;
            let currentRank = 1;
            let totalRanks = 1;

            if (ability.extraRanks) {
                totalRanks = 1 + ability.extraRanks.length;
                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    const [rankAbilityId, rankSpellId] = ability.extraRanks[rankIndex];
                    if (knownRecipes.has(rankAbilityId)) {
                        has = true;
                        hasRanks = true;
                        currentRank = rankIndex + 2;
                        spellId = rankSpellId;
                        break;
                    }
                }

                if (!has && knownRecipes.has(ability.id)) {
                    has = true;
                }

                if (totalRanks > 1) {
                    if (currentRank === totalRanks && !$charactersState.professionsShowLearned) {
                        continue;
                    }

                    hasRanks = true;
                }
            } else {
                if (knownRecipes.has(ability.id)) {
                    if (!$charactersState.professionsShowLearned) {
                        continue;
                    }

                    if (
                        ability.firstCraftQuestId &&
                        userState.quests.characterById
                            .get(character.id)
                            .hasQuestById.has(ability.firstCraftQuestId) &&
                        !$charactersState.professionsShowAlreadyCrafted
                    ) {
                        continue;
                    }

                    if (
                        !ability.firstCraftQuestId &&
                        !$charactersState.professionsShowAlreadyCrafted
                    ) {
                        continue;
                    }

                    has = true;
                }
            }

            if (
                (!has || (hasRanks && currentRank === 0)) &&
                !$charactersState.professionsShowUnlearned
            ) {
                continue;
            }

            abilities.push([ability, has, spellId, currentRank, totalRanks, requiredAbility]);
        }
    }
</script>

<style lang="scss">
    table {
        break-inside: avoid;
        margin-bottom: 1rem;
        //overflow: hidden; /* Firefox fix */
        width: 100%;
    }
    td {
        padding: 0.2rem 0.4rem;
    }
    thead {
        tr {
            th {
                background: $highlight-background;
                font-weight: normal;
                padding: 0.2rem 0.4rem;
                text-align: left;
            }
        }
    }
    .has-crafted {
        padding-left: 0.3rem;
        text-align: center;
        width: 1.6rem;
    }
    .ability-name {
        --image-border-width: 1px;
        --image-margin-top: -5px;

        width: 100%;

        :global(img) {
            margin-right: 0.1rem;
        }
    }
    .tier2 {
        :global(span[data-string='starFull']) {
            color: rgb(215, 215, 215);
        }
    }
    .tier3 {
        :global(span[data-string='starFull']) {
            color: rgb(255, 215, 0);
        }
    }
</style>

{#if abilities.length > 0}
    <table class="table table-striped" data-category-id={category.id}>
        <thead>
            <tr>
                <th class="category-name">{category.name}</th>
            </tr>
        </thead>
        <tbody>
            {#each abilities as [ability, userHas, spellId, currentRank, totalRanks, requiredAbility] (spellId)}
                {@const name =
                    ability.name ||
                    wowthingData.items.items[ability.itemIds[0]]?.name ||
                    `Spell #${spellId}`}
                <tr data-ability-id={ability.id}>
                    <td
                        class="ability-name text-overflow"
                        class:status-success={userHas}
                        class:status-fail={!userHas}
                        class:tier2={name.includes('Tier2')}
                        class:tier3={name.includes('Tier3')}
                    >
                        <div class="flex-wrapper">
                            <div class="item-info text-overflow">
                                <WowheadLink id={spellId} type="spell">
                                    <WowthingImage
                                        name={ability.itemIds[0] > 0
                                            ? `item/${ability.itemIds[0]}`
                                            : `spell/${spellId}`}
                                        size={20}
                                        border={1}
                                    />

                                    {#if ability.faction !== Faction.Neutral}
                                        <FactionIcon faction={ability.faction} />
                                    {/if}

                                    {#if requiredAbility}
                                        <WowthingImage
                                            name={`spell/${requiredAbility}`}
                                            size={20}
                                            border={1}
                                            tooltip={professionSpecializationSpells[
                                                requiredAbility
                                            ]}
                                        />
                                    {/if}

                                    <ParsedText text={name} />
                                </WowheadLink>
                            </div>

                            <div class="extra-info flex-wrapper">
                                {#if hasRanks}
                                    <SkillRanks {ability} {currentRank} {totalRanks} {userHas} />
                                {:else}
                                    <CraftLevels
                                        currentSkill={charSubProfession?.skillCurrent || 0}
                                        {ability}
                                    />

                                    {#if hasFirstCraft}
                                        <span class="has-crafted">
                                            {#if ability.firstCraftQuestId}
                                                {@const hasCrafted = userState.quests.characterById
                                                    .get(character.id)
                                                    .hasQuestById.has(ability.firstCraftQuestId)}
                                                <IconifyIcon
                                                    extraClass={hasCrafted
                                                        ? 'status-success'
                                                        : 'status-fail'}
                                                    icon={hasCrafted ? uiIcons.yes : uiIcons.no}
                                                    tooltip={hasCrafted
                                                        ? 'Learned and crafted'
                                                        : userHas
                                                          ? 'Learned and not crafted'
                                                          : 'Unlearned'}
                                                />
                                            {/if}
                                        </span>
                                    {/if}
                                {/if}
                            </div>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
