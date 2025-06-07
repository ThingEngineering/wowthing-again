import { get } from 'svelte/store';

import { staticStore } from '@/shared/stores/static';
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
    public itemsByAppearanceId: Record<number, GuildItem[]> = $state({});
    public itemsByAppearanceSource: Record<string, GuildItem[]> = $state({});
    public itemsById: Record<number, GuildItem[]> = $state({});

    public init(
        id: number,
        realmId: number,
        name: string,
        slug: string,
        rawItems?: GuildItemArray[],
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

        const staticData = get(staticStore);

        this.realm = staticData.realms[this.realmId];
    }
}
export type GuildArray = Parameters<Guild['init']>;
