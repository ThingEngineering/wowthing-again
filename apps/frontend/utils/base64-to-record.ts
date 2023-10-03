import { decode } from 'base64-arraybuffer'

import { TypedArray } from '@/enums/typed-array'


export default function base64ToRecord(arrayType: TypedArray, data: string): Record<number, boolean>
{
    const ret: Record<number, boolean> = {}
    if (data !== null) {
        const decoded = base64ToArray(arrayType, data)
        for (let i = 0; i < decoded.length; i++) {
        ret[decoded[i]] = true
        }
    }
    return ret
}

// achievementId:completedTimestamp dictionary as a packed array:
//   aabbbb = uint16 int32
export function base64ToAchievements(data: string): Record<number, number> {
    const ret: Record<number, number> = {}
    if (data !== null) {
        const bytes = decode(data)
        const view = new DataView(bytes)
        for (let i = 0; i < bytes.byteLength; i += 6) {

            ret[view.getUint16(i, true)] = view.getInt32(i + 2, true)
        }
    }
    return ret
}

function base64ToArray(arrayType: TypedArray, data: string): ArrayLike<number> {
    const bytes = decode(data)

    switch (arrayType) {
        case TypedArray.Int16:
            return new Int16Array(bytes)

        case TypedArray.Uint16:
            return new Uint16Array(bytes)

        case TypedArray.Int32:
            return new Int32Array(bytes)

        case TypedArray.Uint32:
            return new Uint32Array(bytes)
    }
}
