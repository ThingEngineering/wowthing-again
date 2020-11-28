export class ReputationTier {
    MaxValue: number
    Name: string
    Percent: string
    Tier: number
    Value: number

    constructor(name: string, tier: number, maxValue: number, value: number, percent: string) {
        this.Name = name
        this.Tier = tier
        this.MaxValue = maxValue
        this.Value = value
        this.Percent = percent
    }
}
