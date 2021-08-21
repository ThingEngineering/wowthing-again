import { WritableFancyStore} from '@/types'
import type { StaticData } from '@/types'


export class StaticDataStore extends WritableFancyStore<StaticData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-static')
    }
}

export const staticStore = new StaticDataStore()
