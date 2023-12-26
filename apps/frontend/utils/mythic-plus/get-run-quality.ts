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
    if (level >= 26) {
        return 'quality6'
    }
    else if (level >= 21) {
        return 'quality5'
    }
    else if (level >= 16) {
        return 'quality4'
    }
    else if (level >= 11) {
        return 'quality3'
    } else if (level >= 6) {
        return 'quality2'
    } else {
        return 'quality1'
    }
}
