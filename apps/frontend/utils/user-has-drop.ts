import { RewardType } from '@/types/enums'
import type { StaticData } from '@/types/data/static'
import type { UserData } from '@/types/user-data'
import type { UserTransmogData } from '@/types/data'


export default function userHasDrop(
    staticData: StaticData,
    userData: UserData,
    userTransmogData: UserTransmogData,
    type: RewardType,
    id: number
): boolean {
    return (
        (
            type === RewardType.Mount &&
            userData.hasMount[id] === true
        ) ||
        (
            type === RewardType.Pet &&
            userData.hasPet[id] === true
        ) ||
        (
            type === RewardType.Toy &&
            userData.hasToy[id] === true
        ) ||
        (
            (
                type === RewardType.Armor ||
                type === RewardType.Cosmetic ||
                type === RewardType.Transmog ||
                type === RewardType.Weapon
            ) &&
            userTransmogData.userHas[staticData.items[id]?.appearanceId || id] === true
        )
    )
}
