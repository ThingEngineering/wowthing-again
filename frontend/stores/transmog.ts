import { WritableFancyStore } from '@/types'
import type { TransmogData } from '@/types/data'


export class TransmogDataStore extends WritableFancyStore<TransmogData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-transmog')
    }
}

export const transmogStore = new TransmogDataStore()
