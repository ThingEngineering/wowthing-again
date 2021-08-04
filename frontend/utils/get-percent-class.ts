export default function getPercentClass(percent: number): string {
    if (percent >= 100) {
        return 'quality5'
    }
    else if (percent >= 75) {
        return 'quality4'
    }
    else if (percent >= 50) {
        return 'quality3'
    }
    else if (percent >= 25) {
        return 'quality2'
    }
    else {
        return 'quality1'
    }
}
