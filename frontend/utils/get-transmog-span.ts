import type {TransmogSetData} from '@/types'
import type {TransmogDataGroup} from '@/types/data'

export default function getTransmogSpan(
    group: TransmogDataGroup,
    set: TransmogSetData,
    skipClasses: Record<string, boolean>
): number {
    let span = set.span
    if (group.type === 'armor') {
        if (set.type === 'leather') {
            if (skipClasses['demon-hunter'] === true) {
                span--
            }
            if (skipClasses['monk'] === true) {
                span--
            }
        }
        else if (set.type === 'plate') {
            if (skipClasses['death-knight'] === true) {
                span--
            }
        }
    }
    return span
}
