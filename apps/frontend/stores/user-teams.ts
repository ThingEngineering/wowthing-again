import { WritableFancyStore } from '@/types/fancy-store'
import type { UserTeamData } from '@/types/data'


export class UserTeamDataStore extends WritableFancyStore<UserTeamData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url = url.replace(/\/(?:public|private).+$/, '/teams')
        }
        return url
    }
}

export const userTeamStore = new UserTeamDataStore()
