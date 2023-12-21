import type { SettingsChoice } from '@/shared/stores/settings/types'


export const commonChoices: SettingsChoice[] = [
    {key: 'accountTag', name: 'Account tag'},
    {key: 'characterLevel', name: 'Character level'},
    {key: 'characterName', name: 'Character name'},
    {key: 'characterIconClass', name: 'Icon - Class'},
    {key: 'characterIconRace', name: 'Icon - Race'},
    {key: 'characterIconSpec', name: 'Icon - Specialization'},
    {key: 'realmName', name: 'Realm name'},
]

export const homeChoices: SettingsChoice[] = [
    {key: 'callings', name: 'Callings'},
    {key: 'covenant', name: 'Covenant'},
    {key: 'emissariesBfa', name: 'Emissaries - BfA'},
    {key: 'emissariesLegion', name: 'Emissaries - Legion'},
    {key: 'gear', name: 'Gear'},
    {key: 'gold', name: 'Gold'},
    {key: 'guild', name: 'Guild'},
    {key: 'itemLevel', name: 'Item level'},
    {key: 'currentLocation', name: 'Location - Current'},
    {key: 'hearthLocation', name: 'Location - Hearth'},
    {key: 'lockouts', name: 'Lockouts'},
    {key: 'keystone', name: 'Mythic+ keystone'},
    {key: 'mythicPlusScore', name: 'Mythic+ score'},
    {key: 'playedTime', name: 'Played time'},
    {key: 'professions', name: 'Professions - Primary'},
    {key: 'professionsSecondary', name: 'Professions - Secondary'},
    {key: 'professionCooldowns', name: 'Profession Cooldowns'},
    {key: 'professionWorkOrders', name: 'Profession Work Orders'},
    {key: 'restedExperience', name: 'Rested XP'},
    {key: 'statusIcons', name: 'Status icons'},
    {key: 'tasks', name: 'Tasks'},
    {key: 'vaultMythicPlus', name: 'Vault - Dungeon'},
    {key: 'vaultPvp', name: 'Vault - PvP'},
    {key: 'vaultRaid', name: 'Vault - Raid'},
]
