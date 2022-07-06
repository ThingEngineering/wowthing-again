import { WritableFancyStore } from '@/types'
import type { UserTeamData } from '@/types/data'


export class UserTeamDataStore extends WritableFancyStore<UserTeamData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/teams'
        }
        return url
    }
}

export const userTeamStore = new UserTeamDataStore()
