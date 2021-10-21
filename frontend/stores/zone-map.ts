import { WritableFancyStore } from '@/types'
import type { ZoneMapData } from '@/types/data'


export class ZoneMapDataStore extends WritableFancyStore<ZoneMapData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-zone-map')
    }
}

export const zoneMapStore = new ZoneMapDataStore()
