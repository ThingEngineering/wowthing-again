import { FarmDropType } from '@/types/enums'
import type { StaticData } from '@/types/data/static'
import type { UserData } from '@/types/user-data'
import type { UserTransmogData } from '@/types/data'


export default function userHasDrop(
    staticData: StaticData,
    userData: UserData,
    userTransmogData: UserTransmogData,
    type: FarmDropType,
    id: number
): boolean {
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
            userTransmogData.userHas[staticData.items[id]?.appearanceId || id] === true
        )
    )
}
