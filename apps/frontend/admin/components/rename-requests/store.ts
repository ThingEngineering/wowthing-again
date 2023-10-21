import type { RenameRequest } from './types'


class RenameRequestsStore {
    private static url = '/admin/rename-requests'

    async fetch(): Promise<RenameRequest[]> {
        const xsrf = document.getElementById('app')
            .getAttribute('data-xsrf')
            
        const response = await fetch(RenameRequestsStore.url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
        })

        if (response.ok) {
            const responseData = await response.json() as RenameRequest[]
            return responseData
        }

        return []
    }

    async approve(userId: number): Promise<boolean> {
        const xsrf = document.getElementById('app')
            .getAttribute('data-xsrf')
        
        const url = `${RenameRequestsStore.url}/approve/${userId}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': xsrf,
            },
        })

        return response.ok
    }

    async decline(userId: number): Promise<boolean> {
        const xsrf = document.getElementById('app')
            .getAttribute('data-xsrf')
        
        const url = `${RenameRequestsStore.url}/decline/${userId}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'RequestVerificationToken': xsrf,
            },
        })

        return response.ok
    }
}

export const renameRequestsStore = new RenameRequestsStore()
