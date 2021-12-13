export interface UserHistoryData {
    gold: Record<number, [string, number][]>
    goldRaw: [string, [number, number, number][]][]
}
