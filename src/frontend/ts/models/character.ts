import { get } from 'svelte/store'

import { data } from '../stores/static-store'


class Character {
    name: string
    realmId: number
    faction: number
    gender: number
    raceId: number
    classId: number
    level: number

    getRaceIcon(size: number): string {
        const race = (get(data) as any).Race[this.raceId]
        return `<img src="https://img.wowthing.org/${race[this.gender === 1 ? 'IconMale' : 'IconFemale']}.png" width="${size}" height="${size}"}>`
    }
    getClassIcon(size: number): string {
        const cls = (get(data) as any).Class[this.classId]
        return `<img src="https://img.wowthing.org/${cls.Icon}.png" width="${size}" height="${size}">`
    }
    getRealmName(): string {
        const realm = (get(data) as any).Realm[this.realmId]
        return realm?.Name ?? "Honkstrasza"
    }
}

export default Character
