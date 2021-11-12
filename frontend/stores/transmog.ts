import sortBy from 'lodash/sortBy'

import { WritableFancyStore } from '@/types'
import type { TransmogData, TransmogDataCategory } from '@/types/data'


export class TransmogDataStore extends WritableFancyStore<TransmogData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-transmog')
    }

    initialize(data: TransmogData): void {
        console.time('TransmogDataStore.initialize')

        const newSets: TransmogDataCategory[][] = []

        for (const sets of data.sets) {
            if (sets === null) {
                newSets.push(null)
            }
            else {
                newSets.push(
                    sortBy(
                        sets,
                        (set) => [
                            set.name.startsWith('<') ? 0 : 1,
                            set.name.startsWith('>') ? 1 : 0,
                        ]
                    )
                )

                for (const set of newSets[newSets.length - 1]) {
                    if (set.name.startsWith('<') || set.name.startsWith('>')) {
                        set.name = set.name.substring(1)
                    }
                }
            }
        }

        data.sets = newSets

        console.timeEnd('TransmogDataStore.initialize')
    }
}

export const transmogStore = new TransmogDataStore()
