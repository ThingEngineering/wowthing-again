export default function getFirstMatch(data: number[][], value: number): number {
    for (let i = 0; i < data.length; i++) {
        const thing = data[i];
        if (value >= thing[0]) {
            return thing[1];
        }
    }

    return 0;
}
