export const holidayMinimumLevel: Record<number, number> = {
    // Timewalking: TBC
    559: 30,
    622: 30,
    623: 30,
    624: 30,
    // Timewalking: WotLK
    562: 30,
    616: 30,
    617: 30,
    618: 30,
    // Timewalking: Cata
    587: 35,
    628: 35,
    629: 35,
    630: 35,
    // Timewalking: MoP
    643: 35,
    652: 35,
    654: 35,
    656: 35,
    // Timewalking: WoD
    1056: 40,
    1063: 40,
    1065: 40,
    1068: 40,
    // Timewalking: Legion
    1263: 45,
    1265: 45,
    1267: 45,
    1269: 45,
    1271: 45,
    1273: 45,
    1275: 45,
    1277: 45,
};

export const pvpBrawlHolidays: Record<number, string> = Object.fromEntries(
    Object.entries({
        arathiBlizzard: [666, 673, 680, 697, 737],
        classicAshran: [1120, 1121, 1122, 1123, 1124],
        compStomp: [1234, 1235, 1236, 1237, 1238],
        cookingImpossible: [1047, 1048, 1049, 1050, 1051],
        deepSix: [702, 704, 705, 706, 736],
        deepwindDunk: [1239, 1240, 1241, 1242, 1243],
        gravityLapse: [659, 663, 670, 677, 684],
        packedHouse: [667, 674, 681, 688, 701],
        shadoPanShowdown: [1232, 1233, 1244, 1245, 1246, 1312],
        southshoreVsTarrenMill: [660, 662, 669, 676, 683],
        templeOfHotmogu: [1166, 1167, 1168, 1169, 1170],
        warsongScramble: [664, 671, 678, 685, 1221],
    })
        .map(([key, values]) => values.map((id) => [id, key]))
        .flat(),
);
