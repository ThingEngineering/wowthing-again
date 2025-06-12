import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';

export default function connectedRealmName(realmId: number): string {
    const realmNames: Record<string, boolean> = {};
    for (const character of userState.general.characters) {
        realmNames[character.realm.name] = true;
    }

    const connectedRealm = wowthingData.static.connectedRealmById.get(realmId);
    const useMe: string[] = [];
    let extra = 0;
    for (const realmName of connectedRealm.realmNames) {
        if (realmNames[realmName]) {
            useMe.push(realmName);
        } else {
            extra++;
        }
    }

    if (useMe.length === 0) {
        useMe.push(connectedRealm.realmNames[0]);
        extra = connectedRealm.realmNames.length - 1;
    }

    let ret = useMe.join(' / ');
    if (extra > 0) {
        ret += ` (+${extra})`;
    }
    return ret;
}
