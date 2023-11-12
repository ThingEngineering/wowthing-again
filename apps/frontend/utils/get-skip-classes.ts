import every from 'lodash/every'

import type { ManualDataTransmogCategory } from '@/types/data/manual'
import type { Settings } from '@/user-home/stores/settings/types'


export default function getSkipClasses(
    settingsData: Settings,
    category?: ManualDataTransmogCategory
): Record<string, boolean|number> {
    const skipClasses: Record<string, boolean|number> = {}

    skipClasses['death-knight'] = !settingsData.transmog.showDeathKnight
    skipClasses['demon-hunter'] = !settingsData.transmog.showDemonHunter
    skipClasses['druid'] = !settingsData.transmog.showDruid
    skipClasses['evoker'] = !settingsData.transmog.showEvoker
    skipClasses['hunter'] = !settingsData.transmog.showHunter
    skipClasses['mage'] = !settingsData.transmog.showMage
    skipClasses['monk'] = !settingsData.transmog.showMonk
    skipClasses['paladin'] = !settingsData.transmog.showPaladin
    skipClasses['priest'] = !settingsData.transmog.showPriest
    skipClasses['rogue'] = !settingsData.transmog.showRogue
    skipClasses['shaman'] = !settingsData.transmog.showShaman
    skipClasses['warlock'] = !settingsData.transmog.showWarlock
    skipClasses['warrior'] = !settingsData.transmog.showWarrior

    if (category) {
        for (const skipClass of (category.skipClasses || [])) {
            skipClasses[skipClass] = true
        }
    }

    skipClasses['shownClass'] = Object.values(skipClasses)
        .filter((skip) => !skip)
        .length

    skipClasses['cloth'] = every([
        skipClasses['mage'],
        skipClasses['priest'],
        skipClasses['warlock'],
    ])
    skipClasses['leather'] = every([
        skipClasses['demon-hunter'],
        skipClasses['druid'],
        skipClasses['monk'],
        skipClasses['rogue'],
    ]),
    skipClasses['mail'] = every([
        skipClasses['evoker'],
        skipClasses['hunter'],
        skipClasses['shaman'],
    ])
    skipClasses['plate'] = every([
        skipClasses['death-knight'],
        skipClasses['paladin'],
        skipClasses['warrior'],
    ])

    skipClasses['shownArmor'] = [skipClasses['cloth'], skipClasses['leather'], skipClasses['mail'], skipClasses['plate']]
        .filter((skip) => !skip)
        .length

    return skipClasses
}
