import { difficultyMap } from '@/data/difficulty';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';
import type { ManualDataZoneMapDrop } from '@/types/data/manual';

export function getDropName(drop: ManualDataZoneMapDrop): string {
    if (
        drop.type === RewardType.Item ||
        drop.type === RewardType.Cosmetic ||
        drop.type === RewardType.Armor ||
        drop.type === RewardType.Weapon ||
        drop.type === RewardType.Transmog
    ) {
        return wowthingData.items.items[drop.id]?.name || `Unknown item #${drop.id}`;
    } else if (drop.type === RewardType.Achievement) {
        if (drop.subType > 0) {
            return (
                wowthingData.achievements.criteriaTreeById.get(drop.subType)?.description ??
                `Criteria #${drop.subType}`
            );
        } else {
            return (
                wowthingData.achievements.achievementById.get(drop.id)?.name ??
                `Achievement #${drop.id}`
            );
        }
    } else if (drop.type === RewardType.Currency) {
        const currency = wowthingData.static.currencyById.get(drop.id);
        return currency?.name ?? `Currency #${drop.id}`;
    } else if (drop.type === RewardType.Illusion) {
        const enchantmentId = drop.appearanceIds[0][0];
        const illusion = wowthingData.static.illusionByEnchantmentId.get(enchantmentId);
        return illusion?.name || `Illusion #${enchantmentId}`;
    } else if (drop.type === RewardType.Mount) {
        const mount = wowthingData.static.mountById.get(drop.id);
        return mount ? mount.name : `Unknown mount #${drop.id}`;
    } else if (drop.type === RewardType.Pet) {
        const pet = wowthingData.static.petById.get(drop.id);
        return pet ? pet.name : `Unknown pet #${drop.id}`;
    } else if (drop.type === RewardType.Quest || drop.type === RewardType.AccountQuest) {
        const questName = wowthingData.static.questNameById.get(drop.id);
        return questName || `Quest #${drop.id}`;
    } else if (drop.type === RewardType.Reputation) {
        const reputation = wowthingData.static.reputationById.get(drop.id);
        return reputation?.name || `Reputation #${drop.id}`;
    } else if (drop.type === RewardType.Toy) {
        const toy = wowthingData.static.toyById.get(drop.id);
        return toy?.name || `Unknown toy #${drop.id}`;
    } else if (drop.type === RewardType.XpQuest) {
        return 'Bonus XP';
    } else if (drop.type === RewardType.InstanceSpecial) {
        return difficultyMap[drop.id].name;
    } else if (drop.type === RewardType.SetSpecial) {
        return drop.limit[0];
    } else if (drop.type === RewardType.CharacterTrackingQuest && drop.note) {
        return drop.note;
    } else {
        return '???';
    }
}
