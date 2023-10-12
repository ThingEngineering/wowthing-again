import type { StaticDataRealm } from '@/shared/stores/static/types'

import { GuildItem, type GuildItemArray } from './item'

import type { ContainsItems, HasNameAndRealm, UserItem } from '../shared'


export class Guild implements ContainsItems, HasNameAndRealm {
    public realm: StaticDataRealm
    public items: GuildItem[] = []

    public itemsByAppearanceId: Record<number, UserItem[]>
    public itemsByAppearanceSource: Record<string, UserItem[]>
    public itemsById: Record<number, UserItem[]>

    constructor(
        public id: number,
        public realmId: number,
        public name: string,
        rawItems?: GuildItemArray[]
    ) {
        this.itemsByAppearanceId = {}
        this.itemsByAppearanceSource = {}
        this.itemsById = {}

        for (const rawItem of (rawItems || [])) {
            const obj = new GuildItem(...rawItem) 
            this.items.push(obj)
        }
    }
}
export type GuildArray = ConstructorParameters<typeof Guild>
