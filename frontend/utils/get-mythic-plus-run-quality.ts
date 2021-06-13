import type {CharacterMythicPlusRun} from '@/types'


export default function getMythicPlusRunQuality(run: CharacterMythicPlusRun | number): string {
    let level: number = 0
    if (typeof(run) !== 'number') {
        if (!run.timed) {
            return 'quality0'
        }
        level = run.keystoneLevel
    }
    else {
        level = run
    }

    if (level >= 20) {
        return 'quality5'
    }
    else if (level >= 15) {
        return 'quality4'
    }
    else if (level >= 10) {
        return 'quality3'
    }
    else if (level >= 5) {
        return 'quality2'
    }
    else {
        return 'quality1'
    }
}
