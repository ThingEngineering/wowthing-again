import Base64ArrayBuffer from 'base64-arraybuffer'

import type {Dictionary} from '@/types'
import {TypedArray} from '@/types/enums'

export default function base64ToDictionary(arrayType: TypedArray, data: string): Dictionary<boolean>
{
    const ret: Dictionary<boolean> = {}
    if (data !== null) {
        const bytes = Base64ArrayBuffer.decode(data)
        let decoded: ArrayLike<number>

        switch (arrayType) {
            case TypedArray.Int16:
                decoded = new Int16Array(bytes)
                break

            case TypedArray.Uint16:
                decoded = new Uint16Array(bytes)
                break;

            case TypedArray.Int32:
                decoded = new Int32Array(bytes)
                break;

            case TypedArray.Uint32:
                decoded = new Uint32Array(bytes)
                break;
        }

        for (let i = 0; i < decoded.length; i++) {
            ret[decoded[i]] = true
        }
    }

    return ret
}
