import sortBy from 'lodash/sortBy'

import { expansionMap, expansionSlugMap } from '@/data/expansion'
import { typeOrderMap } from '@/data/inventory-type'
import { weaponSubclassOrderMap, weaponSubclassToString } from '@/data/weapons'
import { ArmorType } from '@/enums/armor-type'
import { ItemClass } from '@/enums/item-class'
import { WritableFancyStore } from '@/types'
import { AppearanceDataAppearance, AppearanceDataSet, type AppearanceData } from '@/types/data/appearance'
import { leftPad } from '@/utils/formatting'
import type { StaticData } from '@/stores/static/types'


export class AppearanceDataStore extends WritableFancyStore<AppearanceData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-appearance')
    }

    setup(staticData: StaticData): void {
        if (this.value.rawAppearances === null) {
            return
        }

        console.time('AppearanceDataStore.setup')

        this.update((state) => {
            const byExpansion: Record<number, Record<string, AppearanceDataSet>> = {}
            for (const expansion of Object.values(expansionMap)) {
                byExpansion[expansion.id] = {}
            }

            for (const [key, objects] of Object.entries(state.rawAppearances)) {
                const [expansion, cls, subClass, inventoryType] = key.split('|').map(n => parseInt(n))

                if (byExpansion[expansion] === undefined) {
                    // console.warn('Invalid appearance expansion:', key)
                    continue
                }

                let sortKey: string
                let nameParts: string[]
                switch (cls) {
                    case ItemClass.Armor:
                        nameParts = [
                            'Armor',
                            this.getArmorSubType(staticData, subClass, inventoryType)
                        ]
                        if (subClass >= 1 && subClass <= 4) {
                            sortKey = `00|${leftPad(subClass, 2, '0')}|${leftPad(typeOrderMap[inventoryType] || 99, 2, '0')}`
                        }
                        else {
                            sortKey = `01|${nameParts[1]}`
                        }
                        break
                
                    case ItemClass.Weapon:
                        nameParts = [
                            'Weapon',
                            weaponSubclassToString[subClass] || `?${subClass}?`
                        ]
                        sortKey = `05|${leftPad(weaponSubclassOrderMap[subClass] || 99, 2, '0')}`
                        break
                
                    default:
                        nameParts = [`?${cls}?`]
                        sortKey = `09|${leftPad(cls, 2, '0')}`
                        break
                }

                const name = nameParts.join(' - ')
                byExpansion[expansion][name] ||= new AppearanceDataSet(name, sortKey)
                byExpansion[expansion][name].appearances.push(...objects.map(
                    (array) => new AppearanceDataAppearance(...array)
                ))
            }
            state.rawAppearances = null

            state.appearances = Object.fromEntries(
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

            for (const [expansion, sets] of sortBy(Object.entries(state.appearances), ([exp,]) => 100 - parseInt(exp))) {
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
                        state.appearances[typeName] ||= []

                        const dataSet = new AppearanceDataSet(
                            expansionSlugMap[expansion.split('--')[1]].name,
                            null
                        )
                        dataSet.appearances = set.appearances

                        state.appearances[typeName].push(dataSet)
                    }
                }
                //console.log(expansion, sets)
            }

            return state
        })

        console.timeEnd('AppearanceDataStore.setup')
    }

    private getArmorSubType(staticData: StaticData, subClass: number, inventoryType: number): string {
        const slotString = staticData.inventoryTypes[inventoryType]
        //const slotString = (InventoryType[inventoryType] || `?${inventoryType}?`).replace('2', '')
        if (subClass >= 1 && subClass <= 4) {
            const typeString = ArmorType[subClass] || `?${subClass}?`
            return `${typeString} ${slotString}`
        }
        else {
            return slotString
        }
    }
}

export const appearanceStore = new AppearanceDataStore()
