

export default function leftPad(n: number, digits: number): string {
    let ret = n.toString()
    if (ret.length < digits) {
        ret = `${'&nbsp;'.repeat(digits - ret.length)}${ret}`
    }
    return ret
}
