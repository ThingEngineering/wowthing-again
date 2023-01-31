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

            if (expansion < 0) {
                console.log('Broken appearance?', key)
                continue
            }

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
