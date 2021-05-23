import type {CharacterMythicPlusRun} from '../types'


export default function getMythicPlusRunQuality(run: CharacterMythicPlusRun): string {
    if (!run.timed) {
        return 'quality0'
    }
    else {
        if (run.keystoneLevel >= 20) {
            return 'quality5'
        }
        else if (run.keystoneLevel >= 15) {
            return 'quality4'
        }
        else if (run.keystoneLevel >= 10) {
            return 'quality3'
        }
        else if (run.keystoneLevel >= 5) {
            return 'quality2'
        }
        else {
            return 'quality1'
        }
    }
}
