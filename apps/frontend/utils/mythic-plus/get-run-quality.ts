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
    if (level >= 20) {
        return 'quality5'
    } else if (level >= 15) {
        return 'quality4'
    } else if (level >= 10) {
        return 'quality3'
    } else if (level >= 5) {
        return 'quality2'
    } else {
        return 'quality1'
    }
}
