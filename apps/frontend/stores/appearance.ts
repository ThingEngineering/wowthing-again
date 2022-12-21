import find from 'lodash/find'
import sortBy from 'lodash/sortBy'

import { expansionMap, expansionSlugMap } from '@/data/expansion'
import { typeOrder } from '@/data/inventory-type'
import { weaponSubclassOrder, weaponSubclassToString } from '@/data/weapons'
import { UserCount, WritableFancyStore } from '@/types'
import { AppearanceDataAppearance, AppearanceDataSet, type AppearanceData } from '@/types/data/appearance'
import { ArmorType, InventoryType, ItemClass } from '@/enums'
import leftPad from '@/utils/left-pad'
import type { UserTransmogData } from '@/types/data'


export class AppearanceDataStore extends WritableFancyStore<AppearanceData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-appearance')
    }

    initialize(data: AppearanceData): void {
        console.time('AppearanceDataStore.initialize')

        data.appearances = {}

        const byExpansion: Record<number, Record<string, AppearanceDataSet>> = {}
        for (const key in data.rawAppearances) {
            const [expansion, cls, subClass, inventoryType] = key.split('|').map(n => parseInt(n))
            byExpansion[expansion] ||= {}

            let sortKey: string
            const nameParts: string[] = []
            switch(cls) {
                case ItemClass.Armor:
                    nameParts.push('Armor')
                    nameParts.push(this.getArmorSubType(subClass, inventoryType))
                    if (subClass >= 1 && subClass <= 4) {
                        sortKey = `00|${leftPad(subClass, 2, '0')}|${leftPad(typeOrder.indexOf(inventoryType), 2, '0')}`
                    }
                    else {
                        sortKey = `01|${nameParts[1]}`
                    }
                    break
                
                case ItemClass.Weapon:
                    nameParts.push('Weapon')
                    nameParts.push(weaponSubclassToString[subClass] || `?${subClass}?`)
                    sortKey = `05|${leftPad(weaponSubclassOrder.indexOf(subClass), 2, '0')}`
                    break
                
                default:
                    nameParts.push(`?${cls}?`)
                    sortKey = `09|${leftPad(cls, 2, '0')}`
                    break
            }

            const objects = data.rawAppearances[key].map(
                (array) => new AppearanceDataAppearance(...array)
            )

            const name = nameParts.join(' - ')
            byExpansion[expansion][name] ||= new AppearanceDataSet(name, sortKey)
            byExpansion[expansion][name].appearances.push(...objects)
        }
        data.rawAppearances = null

        data.appearances = Object.fromEntries(
            sortBy(
                Object.entries(byExpansion),
                ([key,]) => 100 - parseInt(key)
            ).map(
                ([key, groups]) => [
                    `expansion--${expansionMap[parseInt(key)].slug}`,
                    sortBy(
                        Object.values(groups),
                        (group) => group.sortKey
                    )
                ]
            )
        )

        for (const [expansion, sets] of sortBy(Object.entries(data.appearances), ([exp,]) => 100 - parseInt(exp))) {
            for (const set of sets) {
                let typeName: string

                const armorMatches = set.name.match(/^Armor - (Cloth|Leather|Mail|Plate) (Head|Shoulders|Chest|Wrist|Hands|Waist|Legs|Feet)/)
                if (armorMatches) {
                    typeName = `${armorMatches[1].toLowerCase()}--${armorMatches[2].toLowerCase()}`
                }
                else {
                    const weaponMatches = set.name.match(/^Weapon - (.*?)$/)
                    if (weaponMatches) {
                        typeName = `weapons--${weaponMatches[1].toLowerCase().replace(/ /g, '-')}`
                    }
                }

                if (typeName) {
                    data.appearances[typeName] ||= []

                    const dataSet = new AppearanceDataSet(
                        expansionSlugMap[expansion.split('--')[1]].name,
                        null
                    )
                    dataSet.appearances = set.appearances

                    data.appearances[typeName].push(dataSet)
                }
            }
            //console.log(expansion, sets)
        }

        console.timeEnd('AppearanceDataStore.initialize')
    }

    setup(
        userTransmogData: UserTransmogData,
    ) {
        console.time('AppearanceDataStore.setup')

        const stats: Record<string, UserCount> = {}
        const overallCount = stats['OVERALL'] = new UserCount()
        const overallSeen: Record<number, boolean> = {}

        for (const [key, sets] of Object.entries(this.value.data.appearances)) {
            const parentCount = stats[key.split('--')[0]] = new UserCount()
            const catCount = stats[key] = new UserCount()

            for (const set of sets) {
                const setCount = stats[`${key}--${set.name}`] = new UserCount()

                for (const appearance of set.appearances) {
                    if (!overallSeen[appearance.appearanceId]) {
                        overallCount.total++
                    }

                    parentCount.total++
                    catCount.total++
                    setCount.total++
                    
                    if (userTransmogData.userHas[appearance.appearanceId]) {
                        if (!overallSeen[appearance.appearanceId]) {
                            overallCount.have++
                        }

                        parentCount.have++
                        catCount.have++
                        setCount.have++
                    }

                    overallSeen[appearance.appearanceId] = true
                }
            }
        }

        this.update((state) => {
            state.data.stats = stats
            return state
        })

        console.timeEnd('AppearanceDataStore.setup')
    }

    private getArmorSubType(subClass: number, inventoryType: number): string {
        const typeString = ArmorType[subClass] || `?${subClass}?`
        const slotString = (InventoryType[inventoryType] || `?${inventoryType}?`).replace('2', '')
        if (subClass >= 1 && subClass <= 4) {
            return `${typeString} ${slotString}`
        }
        else {
            return slotString
        }
    }
}

export const appearanceStore = new AppearanceDataStore()
