import orderBy from 'lodash/orderBy';

import type { StaticData, StaticDataReputation } from '@/shared/stores/static/types';
import type {
    Character,
    CharacterReputationParagon,
    CharacterReputationReputation,
    UserData,
} from '@/types';
import type { ManualDataReputationSet } from '@/types/data/manual';
import findReputationTier from '@/utils/find-reputation-tier';

interface GetRenownDataParameters {
    character?: Character;
    reputation: ManualDataReputationSet;
    reputationsIndex: number;
    reputationSetsIndex: number;
    slug: string;
    staticData: StaticData;
    userData: UserData;
}

class RenownData {
    public characterParagon: CharacterReputationParagon;
    public characterRep: CharacterReputationReputation;
    public cls: string;
    public dataRep: StaticDataReputation;
    public renownLevel: string;
}

export function getRenownData({
    character,
    reputation,
    reputationsIndex,
    reputationSetsIndex,
    slug,
    staticData,
    userData,
}: GetRenownDataParameters): RenownData {
    const ret = new RenownData();

    if (!reputation) {
        return ret;
    }

    character ||= userData.characters[0];

    ret.characterRep = character.reputationData[slug].sets[reputationsIndex][reputationSetsIndex];
    ret.dataRep = staticData.reputations[ret.characterRep.reputationId];

    const actualCharacter = !ret.dataRep.accountWide
        ? character
        : orderBy(
              userData.activeCharacters.filter(
                  (char) => !!char.reputationData[slug].sets[reputationsIndex][reputationSetsIndex],
              ),
              (char) =>
                  -char.reputationData[slug].sets[reputationsIndex][reputationSetsIndex].value,
          )[0];

    ret.characterRep =
        actualCharacter.reputationData[slug].sets[reputationsIndex][reputationSetsIndex];
    if (ret.characterRep.value !== -1) {
        if (ret.dataRep.renownCurrencyId > 0) {
            const currency = staticData.currencies[ret.dataRep.renownCurrencyId];
            const maxRenown = currency.maxTotal;

            let tier = ret.characterRep.value / 2500;
            ret.cls = `quality${1 + Math.floor(tier / (maxRenown / 5))}`;

            ret.characterParagon = actualCharacter.paragons?.[ret.characterRep.reputationId];
            if (ret.characterParagon) {
                tier += ret.characterParagon.current / ret.characterParagon.max;
            }

            ret.renownLevel = (Math.floor(tier * 100) / 100).toFixed(2);
        } else {
            const tiers =
                staticData.reputationTiers[ret.dataRep.tierId] || staticData.reputationTiers[0];
            const repTier = findReputationTier(tiers, ret.characterRep.value);
            ret.cls = `reputation${repTier.tier} reputation${repTier.tier}-border`;
            ret.renownLevel = `${repTier.percent}%`;
        }
    }

    return ret;
}
