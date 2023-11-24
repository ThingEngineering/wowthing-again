const resultCache: Record<number, number> = {}

export function countSetBits(num: number): number {
    if (resultCache[num]) {
        return resultCache[num]
    }

    let i = Math.floor(num / 0x100000000);
    //      if (i > 0) {
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    i = (i + (i >> 4)) & 0x0f0f0f0f;
    i = i + (i >> 8);
    i = i + (i >> 16);
    let count = i & 0x3f;
    i = num & 0xffffffff;
    //      }
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    i = (i + (i >> 4)) & 0x0f0f0f0f;
    i = i + (i >> 8);
    i = i + (i >> 16);
    count += i & 0x3f;
    
    resultCache[num] = count
    return count;
}
