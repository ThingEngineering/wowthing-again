import { get } from 'svelte/store'

import { FarmDropType } from '@/types/enums'
import type { StaticData } from '@/types/static-data'
import type { UserData } from '@/types/user-data'
import type { UserTransmogData } from '@/types/data'
import { staticStore, userStore, userTransmogStore } from '@/stores'


export default function userHasDrop(
    //userData: UserData,
    type: FarmDropType,
    id: number
): boolean {
    const staticData: StaticData = get(staticStore).data
    const userData: UserData = get(userStore).data
    const userTransmogData: UserTransmogData = get(userTransmogStore).data

    return (
        (
            type === FarmDropType.Mount &&
            userData.mounts[staticData.spellToMount[id]] === true
        ) ||
        (
            type === FarmDropType.Pet &&
            userData.pets[staticData.creatureToPet[id]] !== undefined
        ) ||
        (
            type === FarmDropType.Toy &&
            userData.toys[id] === true
        ) ||
        (
            (
                type === FarmDropType.Armor ||
                type === FarmDropType.Cosmetic ||
                type === FarmDropType.Transmog ||
                type === FarmDropType.Weapon
            ) &&
            userTransmogData.userHas[id] === true
        )
    )
}
