import type { IconifyIcon } from '@iconify/types'

import * as iconLibrary from '../library'
import { RewardType } from '@/enums/reward-type'


export const rewardTypeIcons: Record<number, IconifyIcon> = {
    [RewardType.Achievement]: iconLibrary.mdiTrophy,
    [RewardType.Armor]: iconLibrary.mdiTshirtCrew,
    [RewardType.Cosmetic]: iconLibrary.mdiWizardHat,
    [RewardType.Currency]: iconLibrary.gameTwoCoins,
    [RewardType.Illusion]: iconLibrary.mdiAutoFix,
    [RewardType.Item]: iconLibrary.mdiGiftOutline,
    [RewardType.Mount]: iconLibrary.mdiUnicorn,
    [RewardType.Pet]: iconLibrary.gameFrog,
    [RewardType.Quest]: iconLibrary.mdiExclamationThick,
    [RewardType.Toy]: iconLibrary.mdiDiceMultiple,
    [RewardType.Transmog]: iconLibrary.mdiWizardHat,
    [RewardType.Weapon]: iconLibrary.mdiAxeBattle,
    [RewardType.XpQuest]: iconLibrary.gameUpgrade,

    [RewardType.InstanceSpecial]: iconLibrary.faDungeon,
    [RewardType.SetSpecial]: iconLibrary.mdiMulticast,
}
