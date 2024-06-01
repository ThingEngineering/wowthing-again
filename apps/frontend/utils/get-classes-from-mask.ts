import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
import { classOrder } from '@/data/character-class';

export function getClassesFromMask(mask: number): PlayableClass[] {
    const ret: PlayableClass[] = [];

    for (const cls of classOrder) {
        const clsMask = PlayableClassMask[PlayableClass[cls] as keyof typeof PlayableClassMask];
        if ((mask & clsMask) === clsMask) {
            ret.push(cls);
        }
    }

    return ret;
}
