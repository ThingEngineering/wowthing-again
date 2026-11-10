import type { SettingsChoice } from '@/shared/stores/settings/types';

export const characterNameTooltipChoices: SettingsChoice[] = [
    { id: 'guild', name: 'Guild' },
    { id: 'itemLevel', name: 'Item level' },
    { id: 'last', name: 'Last seen' },
    { id: 'currentLocation', name: 'Location - Current' },
    { id: 'hearthLocation', name: 'Location - Hearth' },
    { id: 'mythicPlusKeystone', name: 'Mythic+ keystone' },
    { id: 'mythicPlusScore', name: 'Mythic+ score' },
    { id: 'playedTime', name: 'Played time' },
    { id: 'restedXp', name: 'Rested XP' },
];

export const viewSwitcherChoices: SettingsChoice[] = [
    { id: 'gold', name: 'Total/Warbank Gold' },
    { id: 'paragons', name: 'Paragons' },
    { id: 'tasks', name: 'Tasks' },
    { id: 'holidays', name: 'Holidays' },
    { id: 'delves', name: 'Bountiful Delves' },
];
