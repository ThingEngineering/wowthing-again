import { wowthingData } from '@/shared/stores/data';
import { initializeContainsItems } from '@/utils/items/initialize-contains-items';
import type { StaticDataRealm } from '@/shared/stores/static/types';

import { GuildItem, type GuildItemArray } from './item';
import type { ContainsItems, HasNameAndRealm } from '../shared';

export class Guild implements ContainsItems, HasNameAndRealm {
    public id: number;
    public realmId: number;
    public name: string;
    public slug: string;

    public realm: StaticDataRealm;

    public items: GuildItem[] = $state([]);
    public itemsByAppearanceId: Record<number, GuildItem[]> = $state.raw({});
    public itemsByAppearanceSource: Record<string, GuildItem[]> = $state.raw({});
    public itemsById: Record<number, GuildItem[]> = $state.raw({});

    public init(
        id: number,
        realmId: number,
        name: string,
        slug: string,
        rawItems?: GuildItemArray[]
    ) {
        this.id = id;
        this.realmId = realmId;
        this.name = name;
        this.slug = slug;

        const newItems: GuildItem[] = [];
        for (const rawItem of rawItems || []) {
            const obj = new GuildItem(...rawItem);
            newItems.push(obj);
        }
        this.items = newItems;

        this.itemsByAppearanceId = {};
        this.itemsByAppearanceSource = {};
        this.itemsById = {};

        this.realm = wowthingData.static.realmById.get(this.realmId);

        // itemsByAppearanceId, itemsByAppearanceSource, itemsById
        initializeContainsItems(this, newItems);
    }
}
export type GuildArray = Parameters<Guild['init']>;
