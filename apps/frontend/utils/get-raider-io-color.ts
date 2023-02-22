import type { StaticDataRaiderIoScoreTiers } from '@/types/data/static'


export default function getRaiderIoColor(
    tiers: StaticDataRaiderIoScoreTiers,
    score: number
): string {
    if (score === 0) {
        return '#9d9d9d';
    }
    if (tiers) {
        for (let i = 0; i < tiers.score.length; i++) {
            if (score >= tiers.score[i]) {
                return tiers.rgbHex[i]
            }
        }
    }
    return '#ffffff'
}
