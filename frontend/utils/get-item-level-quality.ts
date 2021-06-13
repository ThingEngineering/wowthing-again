// 226 = mythic  5
// 213 = heroic  4
// 200 = normal  3
// 187 = lfr     2
// 174 = ?       1
// 161 = ?       0

export default function getItemLevelQuality(itemLevel: number): number {
    return Math.floor(Math.max(0, Math.min(6, (itemLevel - 148) / 13)))
}
