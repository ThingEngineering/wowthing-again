import { syncSet } from '@/utils/collections/sync-set';
import { SvelteSet } from 'svelte/reactivity';
import { UserCount } from '../user-count';
import { wowthingData } from '@/shared/stores/data';
import { expansionOrder } from '@/data/expansion';
import type {
    StaticDataProfessionAbility,
    StaticDataProfessionCategory,
} from '@/shared/stores/static/types';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
// import { Faction } from '@/enums/faction';
// import { professionSpecializationSpells } from '@/data/professions';

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

    constructor(public id: number) {}

    process(rawProfession: Record<number, CharacterProfessionRaw>) {
        console.log(this.id, rawProfession);

        const allKnownRecipes = new Set<number>();
        for (const [subProfessionId, rawSubProfession] of getNumberKeyedEntries(rawProfession)) {
            const subProfession = (this.subProfessions[subProfessionId] ||=
                new CharacterSubProfession(subProfessionId));
            subProfession.skillCurrent = rawSubProfession.currentSkill;
            subProfession.skillMax = rawSubProfession.maxSkill;

            const subKnownRecipes = new Set<number>();
            for (const abilityId of rawSubProfession.knownRecipes || []) {
                allKnownRecipes.add(abilityId);
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

                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    if (this.knownRecipes.has(ability.extraRanks[rankIndex][0])) {
                        data.stats.have += rankIndex + 2;
                        subProfessionStats.have += rankIndex + 2;
                        break;
                    }
                }
                if (this.knownRecipes.has(ability.id)) {
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

    constructor(public id: number) {}
}
