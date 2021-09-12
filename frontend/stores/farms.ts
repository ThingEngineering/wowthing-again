import { WritableFancyStore } from '@/types'
import type { FarmData } from '@/types/data'


export class FarmDataStore extends WritableFancyStore<FarmData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-farm')
    }
}

export const farmStore = new FarmDataStore()
