import {WritableFancyStore} from '@/types'
import type {UserPetData} from '@/types/data'


export class UserPetDataStore extends WritableFancyStore<UserPetData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/pets'
        }
        return url
    }
}

export const userPetStore = new UserPetDataStore()
