import { RewardType } from '@/enums/reward-type'


export const rewardTypeIcons: Record<number, string> = {
    [RewardType.Achievement]: 'mdiTrophy',
    [RewardType.Armor]: 'mdiTshirtCrew',
    [RewardType.Cosmetic]: 'mdiWizardHat',
    [RewardType.Currency]: 'gameTwoCoins',
    [RewardType.Illusion]: 'mdiAutoFix',
    [RewardType.Item]: 'mdiGiftOutline',
    [RewardType.Mount]: 'mdiUnicorn',
    [RewardType.Pet]: 'gameFrog',
    [RewardType.Quest]: 'mdiExclamationThick',
    [RewardType.Toy]: 'mdiDiceMultiple',
    [RewardType.Transmog]: 'mdiWizardHat',
    [RewardType.Weapon]: 'mdiAxeBattle',
    [RewardType.XpQuest]: 'gameUpgrade',

    [RewardType.InstanceSpecial]: 'faDungeon',
    [RewardType.SetSpecial]: 'mdiMulticast',
}
