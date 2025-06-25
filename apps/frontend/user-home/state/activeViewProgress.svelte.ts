import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { logErrors } from '@/utils/log-errors';
import type { ManualDataProgressCategory, ManualDataProgressGroup } from '@/types/data/manual';

class ActiveViewProgress {
    value = $derived.by(() => logErrors(this._value));

    private _value() {
        const ret: [string, ManualDataProgressCategory, ManualDataProgressGroup][] = [];

        for (const progressKey of settingsState.activeView.homeProgress) {
            const [setSlug, categorySlug, groupIndexString] = progressKey.split('|');

            const set = wowthingData.manual.progressSets.find(
                (sets) => sets?.[0]?.slug === setSlug
            );
            if (!set) continue;

            const category = set.find((cat) => cat?.slug === categorySlug);
            if (!category) continue;

            const group = category.groups[parseInt(groupIndexString)];
            if (!group) continue;

            ret.push([progressKey, category, group]);
        }

        return ret;
    }
}

export const activeViewProgress = new ActiveViewProgress();
