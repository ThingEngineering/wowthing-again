import { WritableFancyStore } from '@/types/fancy-store';
import type { UserModifiedData } from '@/types/user-modified';

export class UserModifiedStore extends WritableFancyStore<UserModifiedData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user');
        if (url) {
            url = url.replace(/\/(?:public|private).+$/, '/modified');
        }
        return url;
    }
}

export const userModifiedStore = new UserModifiedStore(
    JSON.parse(document.getElementById('app').getAttribute('data-modified')),
);
