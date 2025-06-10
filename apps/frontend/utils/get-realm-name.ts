import { wowthingData } from '@/shared/stores/data';

export default function getRealmName(realmId: number): string {
    const realm = wowthingData.static.realmById.get(realmId);
    return realm?.name ?? 'Honkstrasza';
}
