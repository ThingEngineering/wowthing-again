import { Holiday } from '@/enums/holiday';
import { Reputation } from '@/enums/reputation';
import type { ReputationData } from '@/types/reputation-data';
import { groupBy } from 'lodash';

export const reputationMap: Partial<Record<Reputation, ReputationData>> = {
    [Reputation.LegionHighmountainTribe]: {
        emissaryHoliday: Holiday.EmissaryHighmountainTribes,
        emissaryQuestId: 42233,
        icon: 'item/146944', // Insignia
    },
    [Reputation.LegionTheNightfallen]: {
        emissaryHoliday: Holiday.EmissaryNightfallen,
        emissaryQuestId: 42421,
        icon: 'item/146946', // Insignia
    },
    [Reputation.LegionDreamweavers]: {
        emissaryHoliday: Holiday.EmissaryDreamweavers,
        emissaryQuestId: 42170,
        icon: 'item/146942', // Insignia
    },
    [Reputation.LegionTheWardens]: {
        emissaryHoliday: Holiday.EmissaryWardens,
        emissaryQuestId: 42422,
        icon: 'item/146945', // Insignia
    },
    [Reputation.LegionCourtOfFarondis]: {
        emissaryHoliday: Holiday.EmissaryCourtFarondis,
        emissaryQuestId: 42420,
        icon: 'item/146943', // Insignia
    },
    [Reputation.LegionValarjar]: {
        emissaryHoliday: Holiday.EmissaryValarjar,
        emissaryQuestId: 42234,
        icon: 'item/146941', // Insignia
    },
    [Reputation.LegionConjurerMargoss]: {
        icon: 'item/138777', // Drowned Mana
    },
    [Reputation.LegionTalonsVengeance]: {
        icon: 'item/142369', // Ivory Hawkstrider
    },
    [Reputation.LegionArmiesOfLegionfall]: {
        emissaryHoliday: Holiday.EmissaryArmiesLegionfall,
        emissaryQuestId: 48641,
        icon: 'item/146950', // Insignia
    },
    [Reputation.LegionIlyssiaOfTheWaters]: {
        icon: 'item/146848', // Fragmented Enchantment
    },
    [Reputation.LegionKeeperRaynae]: {
        icon: 'item/146959', // Corrupted Globule
    },
    [Reputation.LegionAkuleRiverhorn]: {
        icon: 'item/146960', // Ancient Totem Fragment
    },
    [Reputation.LegionCorbyn]: {
        icon: 'item/146961', // Shiny Bauble,
    },
    [Reputation.LegionShaleth]: {
        icon: 'item/146962', // Golden Minnow
    },
    [Reputation.LegionImpus]: {
        icon: 'item/146963', // Desecrated Seaweed
    },
    [Reputation.LegionChromie]: {
        icon: 'achievement/11941',
    },
    [Reputation.LegionArmyOfTheLight]: {
        emissaryHoliday: Holiday.EmissaryArmyLight,
        emissaryQuestId: 48639,
        icon: 'item/152957', // Insignia
    },
    [Reputation.LegionArgussianReach]: {
        emissaryHoliday: Holiday.EmissaryArgussianReach,
        emissaryQuestId: 48642,
        icon: 'item/152960', // Insignia
    },

    [Reputation.BfaZandalariEmpire]: {
        emissaryHoliday: Holiday.EmissaryProudmooreZandalari,
        emissaryQuestId: 50599,
        icon: 'item/238818', // Commendation
    },
    [Reputation.BfaTalanjisExpedition]: {
        emissaryHoliday: Holiday.EmissaryStormsTalanjis,
        emissaryQuestId: 50602,
        icon: 'item/238816', // Commendation
    },
    [Reputation.BfaTheHonorbound]: {
        emissaryHoliday: Holiday.EmissaryLegionHonorbound,
        emissaryQuestId: 50606,
        icon: 'item/238819', // Commendation
    },
    [Reputation.BfaVoldunai]: {
        emissaryHoliday: Holiday.EmissaryEmbersVoldunai,
        emissaryQuestId: 50603,
        icon: 'item/238817', // Commendation
    },
    [Reputation.Bfa7thLegion]: {
        emissaryHoliday: Holiday.EmissaryLegionHonorbound,
        emissaryQuestId: 50605,
        icon: 'item/238806', // Commendation
    },
    [Reputation.BfaProudmooreAdmiralty]: {
        emissaryHoliday: Holiday.EmissaryProudmooreZandalari,
        emissaryQuestId: 50598,
        icon: 'item/238804', // Commendation
    },
    [Reputation.BfaOrderOfEmbers]: {
        emissaryHoliday: Holiday.EmissaryEmbersVoldunai,
        emissaryQuestId: 50600,
        icon: 'item/238803', // Commendation
    },
    [Reputation.BfaStormsWake]: {
        emissaryHoliday: Holiday.EmissaryStormsTalanjis,
        emissaryQuestId: 50601,
        icon: 'item/238805', // Commendation
    },
    [Reputation.BfaTortollanSeekers]: {
        emissaryHoliday: Holiday.EmissaryTortollans,
        emissaryQuestId: 50604,
        icon: 'item/238822', // Commendation
    },
    [Reputation.BfAChampionsOfAzeroth]: {
        emissaryHoliday: Holiday.EmissaryChampionsAzeroth,
        emissaryQuestId: 50562,
        icon: 'item/238821', // Commendation
    },
    [Reputation.BfaTheUnshackled]: {
        emissaryHoliday: Holiday.EmissaryWavebladeUnshackled,
        emissaryQuestId: 56120,
        icon: 'item/238820', // Commendation
    },
    [Reputation.BfaHunterAkana]: {
        icon: 'achievement/13758',
    },
    [Reputation.BfaFarseerOri]: {
        icon: 'achievement/13760',
    },
    [Reputation.BfaBladesmanInowari]: {
        icon: 'achievement/13759',
    },
    [Reputation.BfaPoenGillbrack]: {
        icon: 'achievement/13756',
    },
    [Reputation.BfaNeriSharpfin]: {
        icon: 'achievement/13750',
    },
    [Reputation.BfaVimBrineheart]: {
        icon: 'achievement/13757',
    },
    [Reputation.BfaRustboltResistance]: {
        icon: 'item/238823', // Commendation
    },
    [Reputation.BfaWavebladeAnkoan]: {
        emissaryHoliday: Holiday.EmissaryWavebladeUnshackled,
        emissaryQuestId: 56119,
        icon: 'item/238809', // Commendation
    },
    [Reputation.BfaRajani]: {
        icon: 'item/238826', // Commendation
    },
    [Reputation.BfaUldumAccord]: {
        icon: 'item/238827', // Commendation
    },
};

export const emissaryQuestToHoliday: Record<number, Holiday> = Object.fromEntries(
    Object.values(reputationMap)
        .filter((rep) => !!rep.emissaryQuestId)
        .map((rep) => [rep.emissaryQuestId, rep.emissaryHoliday])
);

export const holidayToReputations: Partial<Record<Holiday, ReputationData[]>> = groupBy(
    Object.values(reputationMap).filter((rep) => !!rep.emissaryHoliday),
    (rep) => rep.emissaryHoliday
);

export const contractAuras: Record<number, [number, number]> = {
    384317: [2544, 1], // Contract: Artisan's Consortium 1
    384320: [2544, 2], // Contract: Artisan's Consortium 2
    384321: [2544, 3], // Contract: Artisan's Consortium 3
    384468: [2507, 1], // Contract: Dragonscale Expedition 1
    384469: [2507, 2], // Contract: Dragonscale Expedition 2
    384470: [2507, 3], // Contract: Dragonscale Expedition 3
    384461: [2511, 1], // Contract: Iskaara Tuskarr 1
    384460: [2511, 2], // Contract: Iskaara Tuskarr 2
    384459: [2511, 3], // Contract: Iskaara Tuskarr 3
    384465: [2503, 1], // Contract: Maruuk Centaur 1
    384466: [2503, 2], // Contract: Maruuk Centaur 2
    384467: [2503, 3], // Contract: Maruuk Centaur 3
    384462: [2510, 1], // Contract: Valdrakken Accord 1
    384463: [2510, 2], // Contract: Valdrakken Accord 2
    384464: [2510, 3], // Contract: Valdrakken Accord 3
    409666: [2564, 1], // Contract: Loamm Niffen 1
    409665: [2564, 2], // Contract: Loamm Niffen 2
    409664: [2564, 3], // Contract: Loamm Niffen 3
    425308: [2574, 1], // Contract: Dream Wardens 1
    425306: [2574, 2], // Contract: Dream Wardens 2
    425305: [2574, 3], // Contract: Dream Wardens 3
    471131: [2653, 1], // Contract: The Cartels of Undermine 1
    471128: [2653, 2], // Contract: The Cartels of Undermine 2
    471130: [2653, 3], // Contract: The Cartels of Undermine 3
};
