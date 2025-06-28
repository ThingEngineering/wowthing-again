import { UserCount } from '@/types';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import type { ManualDataHeirloomItem } from '@/types/data/manual/heirloom';
import type { ManualDataIllusionItem } from '@/types/data/manual/illusion';

import { DataUserAchievements } from './achievements.svelte';
import { DataUserDerived } from './derived.svelte';
import { DataUserGeneral } from './general.svelte';
import { DataUserQuests } from './quests.svelte';
import { logErrors } from '@/utils/log-errors';

type GenericCategory<T> = {
    name: string;
    items: T[];
};
type DoGenericParameters<T, U> = {
    categories: T[];
    haveFunc: (item: U) => boolean;
    includeUnavailable: boolean;
    haveCountFunc?: (item: U) => number;
    totalCountFunc?: (item: U) => number;
};

type UserCounts = Record<string, UserCount>;

class UserState {
    public achievements = new DataUserAchievements();
    public derived = new DataUserDerived();
    public general = new DataUserGeneral();
    public quests = new DataUserQuests();

    public appearanceMasks = $derived.by(() => logErrors(() => this._appearanceMasks()));
    public heirloomStats = $derived.by(() => this._heirlooms());
    public illusionStats = $derived.by(() => this._illusions());
    public recipes = $derived.by(() => this.derived.doRecipes(this.general.characters));
    public reputations = $derived.by(() => this.derived.doReputations(this.general.characters));

    public mounts = $derived.by(() =>
        this.derived.doCollectible('mounts', wowthingData.manual.mountSets, (id) =>
            this.general.hasMountById.has(id)
        )
    );

    public pets = $derived.by(() =>
        this.derived.doCollectible('pets', wowthingData.manual.petSets, (id) =>
            this.general.hasPetById.has(id)
        )
    );

    public toys = $derived.by(() =>
        this.derived.doCollectible('toys', wowthingData.manual.toySets, (id) =>
            this.general.hasToyByItemId.has(id)
        )
    );

    public something() {
        // TODO: fetch user/achievements/quests
        // TODO: process
        // this.general.process(userData);
    }

    private _appearanceMasks() {
        const hasAppearanceBySource = $state.snapshot(this.general.hasAppearanceBySource);
        const ret = new Map<number, number>();

        for (const [appearanceIdString, items] of Object.entries(
            wowthingData.items.appearanceToItems
        )) {
            const appearanceId = parseInt(appearanceIdString);
            let mask = 0;

            for (const [itemId, modifier] of items) {
                // if (userData.hasSource.has(`${itemId}_${modifier}`)) {
                if (hasAppearanceBySource.has(itemId * 1000 + modifier)) {
                    const item = wowthingData.items.items[itemId];
                    mask |= item.classMask;
                }
            }

            ret.set(appearanceId, mask);
        }

        return ret;
    }

    private _heirlooms(): UserCounts {
        return this.doGeneric({
            categories: wowthingData.manual.heirlooms,
            includeUnavailable: settingsState.value.collections.hideUnavailable,
            haveFunc: (heirloom: ManualDataHeirloomItem) =>
                this.general.heirlooms.get(
                    wowthingData.static.heirloomByItemId.get(heirloom.itemId).id
                ) !== undefined,
            totalCountFunc: (heirloom: ManualDataHeirloomItem) =>
                wowthingData.static.heirloomByItemId.get(heirloom.itemId).upgradeBonusIds.length +
                1,
            haveCountFunc: (heirloom: ManualDataHeirloomItem) => {
                const staticHeirloom = wowthingData.static.heirloomByItemId.get(heirloom.itemId);
                const userCount = this.general.heirlooms.get(staticHeirloom.id);
                return userCount !== undefined ? userCount + 1 : 0;
            },
        });
    }

    private _illusions(): UserCounts {
        return this.doGeneric({
            categories: wowthingData.manual.illusions,
            includeUnavailable: settingsState.value.collections.hideUnavailable,
            haveFunc: (illusion: ManualDataIllusionItem) =>
                userState.general.hasIllusionByEnchantmentId.has(illusion.enchantmentId),
        });
    }

    private doGeneric<T extends GenericCategory<U>, U>(
        params: DoGenericParameters<T, U>
    ): UserCounts {
        const counts: UserCounts = {};
        const overallData = (counts['OVERALL'] = new UserCount());

        for (const category of params.categories) {
            const categoryUnavailable = category.name.startsWith('Unavailable');
            const availabilityData = (counts[categoryUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'] ||=
                new UserCount());
            const categoryData = (counts[category.name] = new UserCount());

            for (const item of category.items) {
                const userHas = params.haveFunc(item);

                if (categoryUnavailable && params.includeUnavailable !== true && !userHas) {
                    continue;
                }

                const totalCount = params.totalCountFunc?.(item) || 1;
                overallData.total += totalCount;
                availabilityData.total += totalCount;
                categoryData.total += totalCount;

                if (userHas) {
                    const haveCount = params.haveCountFunc?.(item) || 1;
                    overallData.have += haveCount;
                    availabilityData.have += haveCount;
                    categoryData.have += haveCount;
                }
            }
        }

        return counts;
    }
}

export const userState = new UserState();
