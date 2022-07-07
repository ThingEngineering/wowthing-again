export interface TransmogData {
    sets: TransmogDataCategory[][]
}

export interface TransmogDataCategory {
    name: string
    slug: string
    groups: TransmogDataGroup[]
    skipClasses: string[]
}

export interface TransmogDataGroup {
    name: string
    tag: string
    type: string
    data: Record<string, TransmogDataGroupData[]>
    dataRaw: Record<string, TransmogDataGroupDataArray[]>
    sets: string[]
}

export class TransmogDataGroupData {
    public wowheadSetId: number
    public name: string
    public items: Record<number, number[]>

    constructor(wowheadSetId: number, name: string, items: number[][]) {
        this.wowheadSetId = wowheadSetId
        this.name = name
        this.items = {}
        for (const itemArray of items) {
            this.items[itemArray[0]] = itemArray.splice(1)
        }
    }
}

type TransmogDataGroupDataArray = ConstructorParameters<typeof TransmogDataGroupData>
