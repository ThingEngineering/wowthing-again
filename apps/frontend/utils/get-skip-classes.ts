import some from 'lodash/some'
import sumBy from 'lodash/sumBy'

import type { Settings } from '@/types'
import type { ManualDataTransmogCategory } from '@/types/data/manual'


export default function getSkipClasses(
    settingsData: Settings,
    category?: ManualDataTransmogCategory
): Record<string, boolean> {
    const skipClasses: Record<string, boolean> = {}

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

    skipClasses['cloth'] = !some([
        skipClasses['mage'],
        skipClasses['priest'],
        skipClasses['warlock'],
    ])
    skipClasses['leather'] = !some([
        skipClasses['demon-hunter'],
        skipClasses['druid'],
        skipClasses['monk'],
        skipClasses['rogue'],
    ]),
    skipClasses['mail'] = !some([
        skipClasses['evoker'],
        skipClasses['hunter'],
        skipClasses['shaman'],
    ])
    skipClasses['plate'] = !some([
        skipClasses['death-knight'],
        skipClasses['paladin'],
        skipClasses['warrior'],
    ])

    return skipClasses
}
