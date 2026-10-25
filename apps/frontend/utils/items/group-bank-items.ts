import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';

import { Constants } from '@/data/constants';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { UserItem } from '@/types/shared';

export function groupBankItems(items: UserItem[]) {
    const ret: Record<number, UserItem[]> = {};

    const itemsByTab = groupBy(items || [], (item) => item.containerId);
    for (const [tabId, tabItems] of getNumberKeyedEntries(itemsByTab)) {
        ret[tabId] = [];

        const itemBySlot = keyBy(tabItems, (item) => item.slot);
        for (let slot = 1; slot <= Constants.bankTabItems; slot++) {
            ret[tabId].push(itemBySlot[slot]);
        }
    }

    return ret;
}
