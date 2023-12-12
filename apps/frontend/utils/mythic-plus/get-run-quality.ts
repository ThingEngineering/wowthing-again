import type { CharacterMythicPlusAddonMapAffix, CharacterMythicPlusRun } from '@/types'


export function getRunQuality(
    run: CharacterMythicPlusRun | number,
): string {
    let level = 0
    if (typeof run !== 'number') {
        if (!run.timed) {
            return 'quality0'
        }
        level = run.keystoneLevel
    }
    else {
        level = run
    }

    return getQuality(level)
}

export function getRunQualityAffix(run: CharacterMythicPlusAddonMapAffix): string {
    return run.overTime ? 'quality0' : getQuality(run.level)
}

function getQuality(level: number): string {
    if (level >= 17) {
        return 'quality4'
    } else if (level >= 9) {
        return 'quality3'
    } else {
        return 'quality2'
    }
}
