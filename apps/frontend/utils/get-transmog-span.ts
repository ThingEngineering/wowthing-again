import type { TransmogSetData } from '@/types';
import type { ManualDataTransmogGroup } from '@/types/data/manual';

export default function getTransmogSpan(
    group: ManualDataTransmogGroup,
    set: TransmogSetData,
    skipClasses: Record<string, boolean | number>,
): number {
    let span = set.span;
    if (group.type === 'armor') {
        if (set.type === 'cloth') {
            if (skipClasses['mage'] === true) {
                span--;
            }
            if (skipClasses['priest'] === true) {
                span--;
            }
            if (skipClasses['warlock'] === true) {
                span--;
            }
        } else if (set.type === 'leather') {
            if (skipClasses['demon-hunter'] === true) {
                span--;
            }
            if (skipClasses['druid'] === true) {
                span--;
            }
            if (skipClasses['monk'] === true) {
                span--;
            }
            if (skipClasses['rogue'] === true) {
                span--;
            }
        } else if (set.type === 'mail') {
            if (skipClasses['evoker'] === true) {
                span--;
            }
            if (skipClasses['hunter'] === true) {
                span--;
            }
            if (skipClasses['shaman'] === true) {
                span--;
            }
        } else if (set.type === 'plate') {
            if (skipClasses['death-knight'] === true) {
                span--;
            }
            if (skipClasses['paladin'] === true) {
                span--;
            }
            if (skipClasses['warrior'] === true) {
                span--;
            }
        }
    }
    return span;
}
