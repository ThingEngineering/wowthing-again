import { RewardType } from '@/types/enums'
import type { ManualData } from '@/types/data/manual'
import type { UserData } from '@/types/user-data'
import type { UserTransmogData } from '@/types/data'


export default function userHasDrop(
    manualData: ManualData,
    userData: UserData,
    userTransmogData: UserTransmogData,
    type: RewardType,
    id: number,
    appearanceId?: number
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
            userTransmogData.userHas[appearanceId ?? manualData.shared.items[id]?.appearanceId] === true
        )
    )
}
