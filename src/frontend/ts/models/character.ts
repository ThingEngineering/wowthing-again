import { data } from '../stores/static-store'


let staticData: any
data.subscribe(value => {
    staticData = value
})

class Character {
    name: string
    realmId: number
    faction: number
    gender: number
    raceId: number
    classId: number
    level: number

    getRealmName(): string {
        const realm = staticData.Realms[this.realmId]
        return realm?.Name ?? "Honkstrasza"
    }
}

export default Character
