import cloneDeep from 'lodash/cloneDeep';
import { SvelteSet } from 'svelte/reactivity';

import { expansionOrder } from '@/data/expansion';
import { wowthingData } from '@/shared/stores/data';
import { syncSet } from '@/utils/collections/sync-set';
import type {
    StaticDataProfessionAbility,
    StaticDataProfessionCategory,
    StaticDataSubProfessionTraitNode,
} from '@/shared/stores/static/types';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

import { UserCount } from '../user-count';
import { professionSpecializationSpells } from '@/data/professions/professions';

export interface CharacterProfessionRaw {
    currentSkill: number;
    maxSkill: number;
    knownRecipes?: number[];
}

export class CharacterProfession {
    public knownRecipes = new SvelteSet<number>();
    public subProfessions: Record<number, CharacterSubProfession> = $state({});

    public filteredCategories = $derived.by(() => this._derivedData.filteredCategories);
    public stats = $derived.by(() => this._derivedData.stats);
    public subProfessionStats = $derived.by(() => this._derivedData.subProfessionStats);
    public subProfessionTraitStats = $derived.by(() => this._derivedData.subProfessionTraitStats);

    constructor(
        public id: number,
        public specializationId?: number
    ) {}

    process(
        rawProfession: Record<number, CharacterProfessionRaw>,
        professionTraits: Record<number, Record<number, number>>
    ) {
        const allKnownRecipes = new Set<number>();
        for (const [subProfessionId, rawSubProfession] of getNumberKeyedEntries(rawProfession)) {
            const subProfession = (this.subProfessions[subProfessionId] ||=
                new CharacterSubProfession(subProfessionId, professionTraits[subProfessionId]));
            subProfession.skillCurrent = rawSubProfession.currentSkill;
            subProfession.skillMax = rawSubProfession.maxSkill;

            const subKnownRecipes = new Set<number>();
            for (const abilityId of rawSubProfession.knownRecipes || []) {
                allKnownRecipes.add(abilityId);
                subKnownRecipes.add(abilityId);

                // known abilities often only has the highest rank, backfill lower ranks
                const { ability } =
                    wowthingData.static.professionAbilityByAbilityId.get(abilityId) || {};
                if (ability?.extraRanks && ability.id !== abilityId) {
                    allKnownRecipes.add(ability.id);
                    subKnownRecipes.add(ability.id);

                    for (const [rankAbilityId] of ability.extraRanks) {
                        if (rankAbilityId === abilityId) {
                            break;
                        }

                        allKnownRecipes.add(rankAbilityId);
                        subKnownRecipes.add(rankAbilityId);
                    }
                }
            }

            syncSet(subProfession.knownRecipes, subKnownRecipes);
        }
        syncSet(this.knownRecipes, allKnownRecipes);
    }

    // state, bleh
    private _derivedData = $derived.by(() => {
        const data = new CharacterProfessionData();

        const staticProfession = wowthingData.static.professionById.get(this.id);

        for (const expansion of expansionOrder) {
            const subProfession = staticProfession.expansionSubProfession[expansion.id];
            if (!subProfession) {
                continue;
            }

            const currentSubProfession = (data.subProfessionStats[subProfession.id] ||=
                new UserCount());

            let rootCategory = staticProfession.expansionCategory?.[expansion.id];
            if (rootCategory) {
                while (rootCategory.children.length === 1) {
                    rootCategory = rootCategory.children[0];
                }
            }

            this.recurseCategory(data, currentSubProfession, rootCategory);

            if (subProfession.traitTrees) {
                const traitStats = (data.subProfessionTraitStats[subProfession.id] =
                    new UserCount());

                const charTraits = this.subProfessions[subProfession.id]?.traits || {};
                for (const traitTree of subProfession.traitTrees) {
                    this.recurseTraits(traitStats, charTraits, traitTree.firstNode);
                }
            }
        }

        return data;
    });

    private recurseCategory(
        data: CharacterProfessionData,
        subProfessionStats: UserCount,
        category: StaticDataProfessionCategory
    ) {
        const filteredCategory: StaticDataProfessionAbility[] = (data.filteredCategories[
            category.id
        ] = []);

        for (const ability of category.abilities || []) {
            const requiredAbility = wowthingData.static.itemToRequiredAbility[ability.itemIds[0]];
            if (
                professionSpecializationSpells[requiredAbility] &&
                // this.specializationId !== undefined &&
                this.specializationId !== requiredAbility
            ) {
                continue;
            }

            // FIXME pass in faction?
            // if (ability.faction !== Faction.Neutral && ability.faction !== this.character.faction) {
            //     continue;
            // }

            // FIXME pass in specializations?
            // const requiredAbility = wowthingData.static.itemToRequiredAbility[ability.itemIds[0]];
            // if (professionSpecializationSpells[requiredAbility]) {
            //     const charSpecialization =
            //         this.character.professionSpecializations[this.currentProfession.professionId];
            //     if (charSpecialization !== undefined && charSpecialization !== requiredAbility) {
            //         continue;
            //     }
            // }

            filteredCategory.push(ability);

            if (ability.extraRanks) {
                data.stats.total += ability.extraRanks.length + 1;
                subProfessionStats.total += ability.extraRanks.length + 1;

                let hadAny = false;
                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    if (this.knownRecipes.has(ability.extraRanks[rankIndex][0])) {
                        data.stats.have += rankIndex + 2;
                        subProfessionStats.have += rankIndex + 2;
                        hadAny = true;
                        break;
                    }
                }
                if (!hadAny && this.knownRecipes.has(ability.id)) {
                    data.stats.have++;
                    subProfessionStats.have++;
                }
            } else {
                data.stats.total++;
                subProfessionStats.total++;

                if (this.knownRecipes.has(ability.id)) {
                    data.stats.have++;
                    subProfessionStats.have++;
                }
            }
        }

        for (const child of category.children || []) {
            this.recurseCategory(data, subProfessionStats, child);
        }
    }

    private recurseTraits(
        stats: UserCount,
        charTraits: Record<number, number>,
        node: StaticDataSubProfessionTraitNode
    ) {
        stats.have += (charTraits[node.nodeId] || 1) - 1;
        stats.total += node.rankMax;

        for (const childNode of node.children || []) {
            this.recurseTraits(stats, charTraits, childNode);
        }
    }
}

class CharacterProfessionData {
    public filteredCategories: Record<number, StaticDataProfessionAbility[]> = {};
    public stats: UserCount = new UserCount();
    public subProfessionStats: Record<number, UserCount> = {};
    public subProfessionTraitStats: Record<number, UserCount> = {};
}

export class CharacterSubProfession {
    public knownRecipes = new SvelteSet<number>();
    public skillCurrent = $state(0);
    public skillMax = $state(0);
    public traits: Record<number, number> = $state({});

    constructor(
        public id: number,
        traits: Record<number, number>
    ) {
        // TODO merge
        this.traits = cloneDeep(traits);
    }
}
