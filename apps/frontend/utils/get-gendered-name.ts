import { Gender } from '@/enums/gender';

export function getGenderedName(name: string, gender: Gender = Gender.Female) {
    const parts = name.split('|');
    return parts[gender] || parts[0];
}
