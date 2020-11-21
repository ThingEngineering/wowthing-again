import { get } from 'svelte/store'

import { data } from '../stores/static-store'
import getImg from '../utils/get-img'


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

    getRaceIcon(size: number): string {
        return getImg(staticData.Race[this.raceId][this.gender === 1 ? 'IconMale' : 'IconFemale'], size)
    }
    getClassIcon(size: number): string {
        return getImg(staticData.Class[this.classId].Icon, size)
    }
    getRealmName(): string {
        const realm = staticData.Realm[this.realmId]
        return realm?.Name ?? "Honkstrasza"
    }
}

export default Character
