import type { SettingsChoice } from '@/shared/stores/settings/types'


export const characterNameTooltipChoices: SettingsChoice[] = [
    { key: 'guild', name: 'Guild' },
    { key: 'itemLevel', name: 'Item level' },
    { key: 'currentLocation', name: 'Location - Current' },
    { key: 'hearthLocation', name: 'Location - Hearth' },
    { key: 'mythicPlusKeystone', name: 'Mythic+ keystone' },
    { key: 'mythicPlusScore', name: 'Mythic+ score' },
    { key: 'playedTime', name: 'Played time' },
    { key: 'restedXp', name: 'Rested XP' },
]
