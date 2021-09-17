import { WritableFancyStore} from '@/types'
import type { StaticData } from '@/types'


export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static')
    }

    initialize(data: StaticData): void {
        data.realms[0] = {
            id: 0,
            region: 1,
            name: 'Honkstrasza',
            slug: 'honkstrasza',
        }
    }
}

export const staticStore = new StaticDataStore()
