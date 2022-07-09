import { get } from 'svelte/store'

import { userStore, userTransmogStore } from '@/stores'
import { FarmDropType } from '@/types/enums'
import type { UserTransmogData } from '@/types/data'
import type { UserData } from '@/types/user-data'


export default function userHasDrop(
    //userData: UserData,
    type: FarmDropType,
    id: number
): boolean {
    const userData: UserData = get(userStore).data
    const userTransmogData: UserTransmogData = get(userTransmogStore).data

    return (
        (
            type === FarmDropType.Mount &&
            userData.hasMount[id] === true
        ) ||
        (
            type === FarmDropType.Pet &&
            userData.hasPet[id] === true
        ) ||
        (
            type === FarmDropType.Toy &&
            userData.hasToy[id] === true
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
