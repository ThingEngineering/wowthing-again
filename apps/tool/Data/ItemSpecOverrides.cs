namespace Wowthing.Tool.Data;

public partial class Hardcoded
{
    private static readonly int[] DeathKnightBlood = [250];
    private static readonly int[] DeathKnightFrostUnholy = [251, 252];
    private static readonly int[] DruidFeralGuardian = [103, 104];
    private static readonly int[] PaladinHoly = [65];
    private static readonly int[] PaladinProtection = [66];
    private static readonly int[] PaladinRetribution = [70];
    private static readonly int[] PriestShadow = [258];
    private static readonly int[] ShamanElemental = [262];
    private static readonly int[] ShamanEnhancement = [263];
    private static readonly int[] ShamanRestoration = [264];
    private static readonly int[] WarriorArmsFury = [71, 72];
    private static readonly int[] WarriorProtection = [73];

    public static readonly Dictionary<int, int[]> ItemSpecOverrides = new()
    {
        // T10 Death Knight
        { 51133, DeathKnightBlood }, // normal helm
        { 51130, DeathKnightBlood }, // normal shoulders
        { 51134, DeathKnightBlood }, // normal chest
        { 51132, DeathKnightBlood }, // normal hands
        { 51131, DeathKnightBlood }, // normal legs
        { 51306, DeathKnightBlood }, // heroic helm
        { 51309, DeathKnightBlood }, // heroic shoulders
        { 51305, DeathKnightBlood }, // heroic chest
        { 51307, DeathKnightBlood }, // heroic hands
        { 51308, DeathKnightBlood }, // heroic legs
        { 51127, DeathKnightFrostUnholy }, // normal helm
        { 51125, DeathKnightFrostUnholy }, // normal shoulders
        { 51129, DeathKnightFrostUnholy }, // normal chest
        { 51128, DeathKnightFrostUnholy }, // normal hands
        { 51126, DeathKnightFrostUnholy }, // normal legs
        { 51312, DeathKnightFrostUnholy }, // heroic helm
        { 51314, DeathKnightFrostUnholy }, // heroic shoulders
        { 51310, DeathKnightFrostUnholy }, // heroic chest
        { 51311, DeathKnightFrostUnholy }, // heroic hands
        { 51313, DeathKnightFrostUnholy }, // heroic legs

        // T10 Druid
        { 51143, DruidFeralGuardian }, // normal helm
        { 51140, DruidFeralGuardian }, // normal shoulders
        { 51141, DruidFeralGuardian }, // normal chest
        { 51144, DruidFeralGuardian }, // normal hands
        { 51142, DruidFeralGuardian }, // normal legs
        { 51296, DruidFeralGuardian }, // heroic helm
        { 51299, DruidFeralGuardian }, // heroic shoulders
        { 51298, DruidFeralGuardian }, // heroic chest
        { 51295, DruidFeralGuardian }, // heroic hands
        { 51297, DruidFeralGuardian }, // heroic legs

        // T10 Paladin
        { 51167, PaladinHoly }, // normal helm
        { 51166, PaladinHoly }, // normal shoulders
        { 51165, PaladinHoly }, // normal chest
        { 51169, PaladinHoly }, // normal hands
        { 51168, PaladinHoly }, // normal legs
        { 51272, PaladinHoly }, // heroic helm
        { 51273, PaladinHoly }, // heroic shoulders
        { 51274, PaladinHoly }, // heroic chest
        { 51270, PaladinHoly }, // heroic hands
        { 51271, PaladinHoly }, // heroic legs
        { 51173, PaladinProtection }, // normal helm
        { 51170, PaladinProtection }, // normal shoulders
        { 51174, PaladinProtection }, // normal chest
        { 51172, PaladinProtection }, // normal hands
        { 51171, PaladinProtection }, // normal legs
        { 51266, PaladinProtection }, // heroic helm
        { 51269, PaladinProtection }, // heroic shoulders
        { 51265, PaladinProtection }, // heroic chest
        { 51267, PaladinProtection }, // heroic hands
        { 51268, PaladinProtection }, // heroic legs
        { 51162, PaladinRetribution }, // normal helm
        { 51160, PaladinRetribution }, // normal shoulders
        { 51164, PaladinRetribution }, // normal chest
        { 51163, PaladinRetribution }, // normal hands
        { 51161, PaladinRetribution }, // normal legs
        { 51277, PaladinRetribution }, // heroic helm
        { 51279, PaladinRetribution }, // heroic shoulders
        { 51275, PaladinRetribution }, // heroic chest
        { 51276, PaladinRetribution }, // heroic hands
        { 51278, PaladinRetribution }, // heroic legs

        // T10 Priest
        { 51183, PriestShadow }, // normal hands
        { 51181, PriestShadow }, // normal legs
        { 51256, PriestShadow }, // heroic hands
        { 51258, PriestShadow }, // heroic legs

        // T10 Shaman
        { 51202, ShamanElemental }, // normal helm
        { 51204, ShamanElemental }, // normal shoulders
        { 51200, ShamanElemental }, // normal chest
        { 51201, ShamanElemental }, // normal hands
        { 51203, ShamanElemental }, // normal legs
        { 51237, ShamanElemental }, // heroic helm
        { 51235, ShamanElemental }, // heroic shoulders
        { 51239, ShamanElemental }, // heroic chest
        { 51238, ShamanElemental }, // heroic hands
        { 51236, ShamanElemental }, // heroic legs
        { 51197, ShamanEnhancement }, // normal helm
        { 51199, ShamanEnhancement }, // normal shoulders
        { 51195, ShamanEnhancement }, // normal chest
        { 51196, ShamanEnhancement }, // normal hands
        { 51198, ShamanEnhancement }, // normal legs
        { 51242, ShamanEnhancement }, // heroic helm
        { 51240, ShamanEnhancement }, // heroic shoulders
        { 51244, ShamanEnhancement }, // heroic chest
        { 51243, ShamanEnhancement }, // heroic hands
        { 51241, ShamanEnhancement }, // heroic legs
        { 51192, ShamanRestoration }, // normal helm
        { 51194, ShamanRestoration }, // normal shoulders
        { 51190, ShamanRestoration }, // normal chest
        { 51191, ShamanRestoration }, // normal hands
        { 51193, ShamanRestoration }, // normal legs
        { 51247, ShamanRestoration }, // heroic helm
        { 51245, ShamanRestoration }, // heroic shoulders
        { 51249, ShamanRestoration }, // heroic chest
        { 51248, ShamanRestoration }, // heroic hands
        { 51246, ShamanRestoration }, // heroic legs

        // T10 Warrior
        { 51212, WarriorArmsFury }, // normal helm
        { 51210, WarriorArmsFury }, // normal shoulders
        { 51214, WarriorArmsFury }, // normal chest
        { 51213, WarriorArmsFury }, // normal hands
        { 51211, WarriorArmsFury }, // normal legs
        { 51227, WarriorArmsFury }, // heroic helm
        { 51229, WarriorArmsFury }, // heroic shoulders
        { 51225, WarriorArmsFury }, // heroic chest
        { 51226, WarriorArmsFury }, // heroic hands
        { 51228, WarriorArmsFury }, // heroic legs
        { 51218, WarriorProtection }, // normal helm
        { 51215, WarriorProtection }, // normal shoulders
        { 51219, WarriorProtection }, // normal chest
        { 51217, WarriorProtection }, // normal hands
        { 51216, WarriorProtection }, // normal legs
        { 51221, WarriorProtection }, // heroic helm
        { 51224, WarriorProtection }, // heroic shoulders
        { 51220, WarriorProtection }, // heroic chest
        { 51222, WarriorProtection }, // heroic hands
        { 51223, WarriorProtection }, // heroic legs
    };
}
