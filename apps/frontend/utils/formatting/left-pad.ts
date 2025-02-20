export function leftPad(n: number, digits: number, pad = '&nbsp;'): string {
    let ret = n.toString();
    if (ret.length < digits) {
        ret = `${pad.repeat(digits - ret.length)}${ret}`;
    }
    return ret;
}
