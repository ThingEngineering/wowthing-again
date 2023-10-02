import type { Gender } from '@/enums/gender'


export function getGenderedName(name: string, gender: Gender) {
    const parts = name.split('|')
    return parts[gender] || parts[0]
}
