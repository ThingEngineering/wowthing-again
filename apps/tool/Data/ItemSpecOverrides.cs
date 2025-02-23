namespace Wowthing.Tool.Data;

public partial class Hardcoded
{
    private static readonly int[] DeathKnightBlood = [250];
    private static readonly int[] DeathKnightFrostUnholy = [251, 252];
    private static readonly int[] DruidBalance = [102];
    private static readonly int[] DruidFeralGuardian = [103, 104];
    private static readonly int[] DruidRestoration = [105];
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
        // Death Knight T9
        { 48529, DeathKnightBlood }, // Alliance helm
        { 48535, DeathKnightBlood }, // Alliance shoulders
        { 48531, DeathKnightBlood }, // Alliance chest
        { 48537, DeathKnightBlood }, // Alliance hands
        { 48533, DeathKnightBlood }, // Alliance legs
        { 48540, DeathKnightBlood }, // Alliance helm 2
        { 48542, DeathKnightBlood }, // Alliance shoulders 2
        { 48538, DeathKnightBlood }, // Alliance chest 2
        { 48539, DeathKnightBlood }, // Alliance hands 2
        { 48541, DeathKnightBlood }, // Alliance legs 2
        { 48560, DeathKnightBlood }, // Horde helm
        { 48562, DeathKnightBlood }, // Horde shoulders
        { 48558, DeathKnightBlood }, // Horde chest
        { 48559, DeathKnightBlood }, // Horde hands
        { 48561, DeathKnightBlood }, // Horde legs
        { 48555, DeathKnightBlood }, // Horde helm 2
        { 48553, DeathKnightBlood }, // Horde shoulders 2
        { 48557, DeathKnightBlood }, // Horde chest 2
        { 48556, DeathKnightBlood }, // Horde hands 2
        { 48554, DeathKnightBlood }, // Horde legs 2
        { 48472, DeathKnightFrostUnholy }, // Alliance helm
        { 48478, DeathKnightFrostUnholy }, // Alliance shoulders
        { 48474, DeathKnightFrostUnholy }, // Alliance chest
        { 48480, DeathKnightFrostUnholy }, // Alliance hands
        { 48476, DeathKnightFrostUnholy }, // Alliance legs
        { 48483, DeathKnightFrostUnholy }, // Alliance helm 2
        { 48485, DeathKnightFrostUnholy }, // Alliance shoulders 2
        { 48481, DeathKnightFrostUnholy }, // Alliance chest 2
        { 48482, DeathKnightFrostUnholy }, // Alliance hands 2
        { 48484, DeathKnightFrostUnholy }, // Alliance legs 2
        { 48503, DeathKnightFrostUnholy }, // Horde helm
        { 48505, DeathKnightFrostUnholy }, // Horde shoulders
        { 48501, DeathKnightFrostUnholy }, // Horde chest
        { 48502, DeathKnightFrostUnholy }, // Horde hands
        { 48504, DeathKnightFrostUnholy }, // Horde legs
        { 48498, DeathKnightFrostUnholy }, // Horde helm 2
        { 48496, DeathKnightFrostUnholy }, // Horde shoulders 2
        { 48500, DeathKnightFrostUnholy }, // Horde chest 2
        { 48499, DeathKnightFrostUnholy }, // Horde hands 2
        { 48497, DeathKnightFrostUnholy }, // Horde legs 2

        // Death Knight T10
        { 50855, DeathKnightBlood }, // A helm
        { 50853, DeathKnightBlood }, // A shoulders
        { 50857, DeathKnightBlood }, // A chest
        { 50856, DeathKnightBlood }, // A hands
        { 50854, DeathKnightBlood }, // A legs
        { 51133, DeathKnightBlood }, // B helm
        { 51130, DeathKnightBlood }, // B shoulders
        { 51134, DeathKnightBlood }, // B chest
        { 51132, DeathKnightBlood }, // B hands
        { 51131, DeathKnightBlood }, // B legs
        { 51306, DeathKnightBlood }, // C helm
        { 51309, DeathKnightBlood }, // C shoulders
        { 51305, DeathKnightBlood }, // C chest
        { 51307, DeathKnightBlood }, // C hands
        { 51308, DeathKnightBlood }, // C legs
        { 50096, DeathKnightFrostUnholy }, // A helm
        { 50098, DeathKnightFrostUnholy }, // A shoulders
        { 50094, DeathKnightFrostUnholy }, // A chest
        { 50095, DeathKnightFrostUnholy }, // A hands
        { 50097, DeathKnightFrostUnholy }, // A legs
        { 51127, DeathKnightFrostUnholy }, // B helm
        { 51125, DeathKnightFrostUnholy }, // B shoulders
        { 51129, DeathKnightFrostUnholy }, // B chest
        { 51128, DeathKnightFrostUnholy }, // B hands
        { 51126, DeathKnightFrostUnholy }, // B legs
        { 51312, DeathKnightFrostUnholy }, // C helm
        { 51314, DeathKnightFrostUnholy }, // C shoulders
        { 51310, DeathKnightFrostUnholy }, // C chest
        { 51311, DeathKnightFrostUnholy }, // C hands
        { 51313, DeathKnightFrostUnholy }, // C legs

        // Druid T9
        { 48158, DruidBalance }, // Alliance helm
        { 48161, DruidBalance }, // Alliance shoulders
        { 48159, DruidBalance }, // Alliance chest
        { 48162, DruidBalance }, // Alliance hands
        { 48160, DruidBalance }, // Alliance legs
        { 48184, DruidBalance }, // Horde helm
        { 48187, DruidBalance }, // Horde shoulders
        { 48186, DruidBalance }, // Horde chest
        { 48183, DruidBalance }, // Horde hands
        { 48185, DruidBalance }, // Horde legs
        { 48214, DruidFeralGuardian }, // Alliance helm
        { 48217, DruidFeralGuardian }, // Alliance shoulders
        { 48216, DruidFeralGuardian }, // Alliance chest
        { 48213, DruidFeralGuardian }, // Alliance hands
        { 48215, DruidFeralGuardian }, // Alliance legs
        { 48211, DruidFeralGuardian }, // Alliance helm 2
        { 48208, DruidFeralGuardian }, // Alliance shoulders 2
        { 48209, DruidFeralGuardian }, // Alliance chest 2
        { 48212, DruidFeralGuardian }, // Alliance hands 2
        { 48210, DruidFeralGuardian }, // Alliance legs 2
        { 48188, DruidFeralGuardian }, // Horde helm
        { 48191, DruidFeralGuardian }, // Horde shoulders
        { 48189, DruidFeralGuardian }, // Horde chest
        { 48192, DruidFeralGuardian }, // Horde hands
        { 48190, DruidFeralGuardian }, // Horde legs
        { 48194, DruidFeralGuardian }, // Horde helm 2
        { 48197, DruidFeralGuardian }, // Horde shoulders 2
        { 48196, DruidFeralGuardian }, // Horde chest 2
        { 48193, DruidFeralGuardian }, // Horde hands 2
        { 48195, DruidFeralGuardian }, // Horde legs 2
        { 48102, DruidRestoration }, // Alliance helm
        { 48131, DruidRestoration }, // Alliance shoulders
        { 48129, DruidRestoration }, // Alliance chest
        { 48132, DruidRestoration }, // Alliance hands
        { 48130, DruidRestoration }, // Alliance legs
        { 48154, DruidRestoration }, // Horde helm
        { 48157, DruidRestoration }, // Horde shoulders
        { 48156, DruidRestoration }, // Horde chest
        { 48153, DruidRestoration }, // Horde hands
        { 48155, DruidRestoration }, // Horde legs

        // Druid T10
        { 50826, DruidFeralGuardian }, // A helm
        { 50824, DruidFeralGuardian }, // A shoulders
        { 50828, DruidFeralGuardian }, // A chest
        { 50827, DruidFeralGuardian }, // A hands
        { 50825, DruidFeralGuardian }, // A legs
        { 51143, DruidFeralGuardian }, // B helm
        { 51140, DruidFeralGuardian }, // B shoulders
        { 51141, DruidFeralGuardian }, // B chest
        { 51144, DruidFeralGuardian }, // B hands
        { 51142, DruidFeralGuardian }, // B legs
        { 51296, DruidFeralGuardian }, // C helm
        { 51299, DruidFeralGuardian }, // C shoulders
        { 51298, DruidFeralGuardian }, // C chest
        { 51295, DruidFeralGuardian }, // C hands
        { 51297, DruidFeralGuardian }, // C legs

        // Paladin T9
        { 48564, PaladinHoly }, // Alliance helm
        { 48572, PaladinHoly }, // Alliance shoulders
        { 48566, PaladinHoly }, // Alliance chest
        { 48574, PaladinHoly }, // Alliance hands
        { 48568, PaladinHoly }, // Alliance legs
        { 48577, PaladinHoly }, // Alliance helm 2
        { 48579, PaladinHoly }, // Alliance shoulders 2
        { 48575, PaladinHoly }, // Alliance chest 2
        { 48576, PaladinHoly }, // Alliance hands 2
        { 48578, PaladinHoly }, // Alliance legs 2
        { 48597, PaladinHoly }, // Horde helm
        { 48595, PaladinHoly }, // Horde shoulders
        { 48599, PaladinHoly }, // Horde chest
        { 48598, PaladinHoly }, // Horde hands
        { 48596, PaladinHoly }, // Horde legs
        { 48592, PaladinHoly }, // Horde helm 2
        { 48590, PaladinHoly }, // Horde shoulders 2
        { 48594, PaladinHoly }, // Horde chest 2
        { 48593, PaladinHoly }, // Horde hands 2
        { 48591, PaladinHoly }, // Horde legs 2
        { 48634, PaladinProtection }, // Alliance helm
        { 48636, PaladinProtection }, // Alliance shoulders
        { 48632, PaladinProtection }, // Alliance chest
        { 48633, PaladinProtection }, // Alliance hands
        { 48635, PaladinProtection }, // Alliance legs
        { 48639, PaladinProtection }, // Alliance helm 2
        { 48637, PaladinProtection }, // Alliance shoulders 2
        { 48641, PaladinProtection }, // Alliance chest 2
        { 48640, PaladinProtection }, // Alliance hands 2
        { 48638, PaladinProtection }, // Alliance legs 2
        { 48654, PaladinProtection }, // Horde helm
        { 48656, PaladinProtection }, // Horde shoulders
        { 48652, PaladinProtection }, // Horde chest
        { 48653, PaladinProtection }, // Horde hands
        { 48655, PaladinProtection }, // Horde legs
        { 48659, PaladinProtection }, // Horde helm 2
        { 48661, PaladinProtection }, // Horde shoulders 2
        { 48657, PaladinProtection }, // Horde chest 2
        { 48658, PaladinProtection }, // Horde hands 2
        { 48660, PaladinProtection }, // Horde legs 2
        { 48604, PaladinRetribution }, // Alliance helm
        { 48606, PaladinRetribution }, // Alliance shoulders
        { 48602, PaladinRetribution }, // Alliance chest
        { 48603, PaladinRetribution }, // Alliance hands
        { 48605, PaladinRetribution }, // Alliance legs
        { 48609, PaladinRetribution }, // Alliance helm 2
        { 48611, PaladinRetribution }, // Alliance shoulders 2
        { 48607, PaladinRetribution }, // Alliance chest 2
        { 48608, PaladinRetribution }, // Alliance hands 2
        { 48610, PaladinRetribution }, // Alliance legs 2
        { 48629, PaladinRetribution }, // Horde helm
        { 48627, PaladinRetribution }, // Horde shoulders
        { 48631, PaladinRetribution }, // Horde chest
        { 48630, PaladinRetribution }, // Horde hands
        { 48628, PaladinRetribution }, // Horde legs
        { 48624, PaladinRetribution }, // Horde helm 2
        { 48622, PaladinRetribution }, // Horde shoulders 2
        { 48626, PaladinRetribution }, // Horde chest 2
        { 48625, PaladinRetribution }, // Horde hands 2
        { 48623, PaladinRetribution }, // Horde legs 2

        // Paladin T10
        { 50867, PaladinHoly }, // A helm
        { 50865, PaladinHoly }, // A shoulders
        { 50869, PaladinHoly }, // A chest
        { 50868, PaladinHoly }, // A hands
        { 50866, PaladinHoly }, // A legs
        { 51167, PaladinHoly }, // B helm
        { 51166, PaladinHoly }, // B shoulders
        { 51165, PaladinHoly }, // B chest
        { 51169, PaladinHoly }, // B hands
        { 51168, PaladinHoly }, // B legs
        { 51272, PaladinHoly }, // C helm
        { 51273, PaladinHoly }, // C shoulders
        { 51274, PaladinHoly }, // C chest
        { 51270, PaladinHoly }, // C hands
        { 51271, PaladinHoly }, // C legs
        { 50862, PaladinProtection }, // A helm
        { 50860, PaladinProtection }, // A shoulders
        { 50864, PaladinProtection }, // A chest
        { 50863, PaladinProtection }, // A hands
        { 50861, PaladinProtection }, // A legs
        { 51173, PaladinProtection }, // B helm
        { 51170, PaladinProtection }, // B shoulders
        { 51174, PaladinProtection }, // B chest
        { 51172, PaladinProtection }, // B hands
        { 51171, PaladinProtection }, // B legs
        { 51266, PaladinProtection }, // C helm
        { 51269, PaladinProtection }, // C shoulders
        { 51265, PaladinProtection }, // C chest
        { 51267, PaladinProtection }, // C hands
        { 51268, PaladinProtection }, // C legs
        { 50326, PaladinRetribution }, // A helm
        { 50324, PaladinRetribution }, // A shoulders
        { 50328, PaladinRetribution }, // A chest
        { 50327, PaladinRetribution }, // A hands
        { 50325, PaladinRetribution }, // A legs
        { 51162, PaladinRetribution }, // B helm
        { 51160, PaladinRetribution }, // B shoulders
        { 51164, PaladinRetribution }, // B chest
        { 51163, PaladinRetribution }, // B hands
        { 51161, PaladinRetribution }, // B legs
        { 51277, PaladinRetribution }, // C helm
        { 51279, PaladinRetribution }, // C shoulders
        { 51275, PaladinRetribution }, // C chest
        { 51276, PaladinRetribution }, // C hands
        { 51278, PaladinRetribution }, // C legs

        // Priest T9
        { 48073, PriestShadow }, // Alliance helm
        { 48072, PriestShadow }, // Alliance hands
        { 48074, PriestShadow }, // Alliance legs
        { 48078, PriestShadow }, // Alliance helm 2
        { 48077, PriestShadow }, // Alliance hands 2
        { 48079, PriestShadow }, // Alliance legs 2
        { 48098, PriestShadow }, // Horde helm
        { 48097, PriestShadow }, // Horde hands
        { 48099, PriestShadow }, // Horde legs
        { 48095, PriestShadow }, // Horde helm 2
        { 48096, PriestShadow }, // Horde hands 2
        { 48094, PriestShadow }, // Horde legs 2

        // Priest T10
        { 50391, PriestShadow }, // A hands
        { 50393, PriestShadow }, // A legs
        { 51183, PriestShadow }, // B hands
        { 51181, PriestShadow }, // B legs
        { 51256, PriestShadow }, // C hands
        { 51258, PriestShadow }, // C legs

        // Shaman T9
        { 48313, ShamanElemental }, // Alliance helm
        { 48315, ShamanElemental }, // Alliance shoulders
        { 48310, ShamanElemental }, // Alliance chest
        { 48312, ShamanElemental }, // Alliance hands
        { 48314, ShamanElemental }, // Alliance legs
        { 48338, ShamanElemental }, // Horde helm
        { 48340, ShamanElemental }, // Horde shoulders
        { 48336, ShamanElemental }, // Horde chest
        { 48337, ShamanElemental }, // Horde hands
        { 48339, ShamanElemental }, // Horde legs
        { 48343, ShamanEnhancement }, // Alliance helm
        { 48345, ShamanEnhancement }, // Alliance shoulders
        { 48341, ShamanEnhancement }, // Alliance chest
        { 48342, ShamanEnhancement }, // Alliance hands
        { 48344, ShamanEnhancement }, // Alliance legs
        { 48348, ShamanEnhancement }, // Alliance helm 2
        { 48350, ShamanEnhancement }, // Alliance shoulders 2
        { 48346, ShamanEnhancement }, // Alliance chest 2
        { 48347, ShamanEnhancement }, // Alliance hands 2
        { 48349, ShamanEnhancement }, // Alliance legs 2
        { 48368, ShamanEnhancement }, // Horde helm
        { 48370, ShamanEnhancement }, // Horde shoulders
        { 48366, ShamanEnhancement }, // Horde chest
        { 48367, ShamanEnhancement }, // Horde hands
        { 48369, ShamanEnhancement }, // Horde legs
        { 48363, ShamanEnhancement }, // Horde helm 2
        { 48361, ShamanEnhancement }, // Horde shoulders 2
        { 48365, ShamanEnhancement }, // Horde chest 2
        { 48364, ShamanEnhancement }, // Horde hands 2
        { 48362, ShamanEnhancement }, // Horde legs 2
        { 48280, ShamanRestoration }, // Alliance helm
        { 48283, ShamanRestoration }, // Alliance shoulders
        { 48281, ShamanRestoration }, // Alliance chest
        { 48284, ShamanRestoration }, // Alliance hands
        { 48282, ShamanRestoration }, // Alliance legs
        { 48297, ShamanRestoration }, // Horde helm
        { 48299, ShamanRestoration }, // Horde shoulders
        { 48295, ShamanRestoration }, // Horde chest
        { 48296, ShamanRestoration }, // Horde hands
        { 48298, ShamanRestoration }, // Horde legs

        // Shaman T10
        { 50843, ShamanElemental }, // A helm
        { 50845, ShamanElemental }, // A shoulders
        { 50841, ShamanElemental }, // A chest
        { 50842, ShamanElemental }, // A hands
        { 50844, ShamanElemental }, // A legs
        { 51202, ShamanElemental }, // B helm
        { 51204, ShamanElemental }, // B shoulders
        { 51200, ShamanElemental }, // B chest
        { 51201, ShamanElemental }, // B hands
        { 51203, ShamanElemental }, // B legs
        { 51237, ShamanElemental }, // C helm
        { 51235, ShamanElemental }, // C shoulders
        { 51239, ShamanElemental }, // C chest
        { 51238, ShamanElemental }, // C hands
        { 51236, ShamanElemental }, // C legs
        { 50832, ShamanEnhancement }, // A helm
        { 50834, ShamanEnhancement }, // A shoulders
        { 50830, ShamanEnhancement }, // A chest
        { 50831, ShamanEnhancement }, // A hands
        { 50833, ShamanEnhancement }, // A legs
        { 51197, ShamanEnhancement }, // B helm
        { 51199, ShamanEnhancement }, // B shoulders
        { 51195, ShamanEnhancement }, // B chest
        { 51196, ShamanEnhancement }, // B hands
        { 51198, ShamanEnhancement }, // B legs
        { 51242, ShamanEnhancement }, // C helm
        { 51240, ShamanEnhancement }, // C shoulders
        { 51244, ShamanEnhancement }, // C chest
        { 51243, ShamanEnhancement }, // C hands
        { 51241, ShamanEnhancement }, // C legs
        { 50837, ShamanRestoration }, // A helm
        { 50839, ShamanRestoration }, // A shoulders
        { 50835, ShamanRestoration }, // A chest
        { 50836, ShamanRestoration }, // A hands
        { 50838, ShamanRestoration }, // A legs
        { 51192, ShamanRestoration }, // B helm
        { 51194, ShamanRestoration }, // B shoulders
        { 51190, ShamanRestoration }, // B chest
        { 51191, ShamanRestoration }, // B hands
        { 51193, ShamanRestoration }, // B legs
        { 51247, ShamanRestoration }, // C helm
        { 51245, ShamanRestoration }, // C shoulders
        { 51249, ShamanRestoration }, // C chest
        { 51248, ShamanRestoration }, // C hands
        { 51246, ShamanRestoration }, // C legs

        // Warrior T9
        { 48371, WarriorArmsFury }, // Alliance helm
        { 48374, WarriorArmsFury }, // Alliance shoulders
        { 48372, WarriorArmsFury }, // Alliance chest
        { 48375, WarriorArmsFury }, // Alliance hands
        { 48373, WarriorArmsFury }, // Alliance legs
        { 48378, WarriorArmsFury }, // Alliance helm 2
        { 48380, WarriorArmsFury }, // Alliance shoulders 2
        { 48376, WarriorArmsFury }, // Alliance chest 2
        { 48377, WarriorArmsFury }, // Alliance hands 2
        { 48379, WarriorArmsFury }, // Alliance legs 2
        { 48388, WarriorArmsFury }, // Horde helm
        { 48390, WarriorArmsFury }, // Horde shoulders
        { 48386, WarriorArmsFury }, // Horde chest
        { 48387, WarriorArmsFury }, // Horde hands
        { 48389, WarriorArmsFury }, // Horde legs
        { 48393, WarriorArmsFury }, // Horde helm 2
        { 48395, WarriorArmsFury }, // Horde shoulders 2
        { 48391, WarriorArmsFury }, // Horde chest 2
        { 48392, WarriorArmsFury }, // Horde hands 2
        { 48394, WarriorArmsFury }, // Horde legs 2
        { 48429, WarriorProtection }, // Alliance helm
        { 48448, WarriorProtection }, // Alliance shoulders
        { 48436, WarriorProtection }, // Alliance chest
        { 48449, WarriorProtection }, // Alliance hands
        { 48445, WarriorProtection }, // Alliance legs
        { 48430, WarriorProtection }, // Alliance helm 2
        { 48454, WarriorProtection }, // Alliance shoulders 2
        { 48450, WarriorProtection }, // Alliance chest 2
        { 48452, WarriorProtection }, // Alliance hands 2
        { 48446, WarriorProtection }, // Alliance legs 2
        { 48458, WarriorProtection }, // Horde helm
        { 48460, WarriorProtection }, // Horde shoulders
        { 48456, WarriorProtection }, // Horde chest
        { 48457, WarriorProtection }, // Horde hands
        { 48459, WarriorProtection }, // Horde legs
        { 48463, WarriorProtection }, // Horde helm 2
        { 48465, WarriorProtection }, // Horde shoulders 2
        { 48461, WarriorProtection }, // Horde chest 2
        { 48462, WarriorProtection }, // Horde hands 2
        { 48464, WarriorProtection }, // Horde legs 2

        // Warrior T10
        { 50080, WarriorArmsFury }, // A helm
        { 50082, WarriorArmsFury }, // A shoulders
        { 50078, WarriorArmsFury }, // A chest
        { 50079, WarriorArmsFury }, // A hands
        { 50081, WarriorArmsFury }, // A legs
        { 51212, WarriorArmsFury }, // B helm
        { 51210, WarriorArmsFury }, // B shoulders
        { 51214, WarriorArmsFury }, // B chest
        { 51213, WarriorArmsFury }, // B hands
        { 51211, WarriorArmsFury }, // B legs
        { 51227, WarriorArmsFury }, // C helm
        { 51229, WarriorArmsFury }, // C shoulders
        { 51225, WarriorArmsFury }, // C chest
        { 51226, WarriorArmsFury }, // C hands
        { 51228, WarriorArmsFury }, // C legs
        { 50848, WarriorProtection }, // A helm
        { 50846, WarriorProtection }, // A shoulders
        { 50850, WarriorProtection }, // A chest
        { 50849, WarriorProtection }, // A hands
        { 50847, WarriorProtection }, // A legs
        { 51218, WarriorProtection }, // B helm
        { 51215, WarriorProtection }, // B shoulders
        { 51219, WarriorProtection }, // B chest
        { 51217, WarriorProtection }, // B hands
        { 51216, WarriorProtection }, // B legs
        { 51221, WarriorProtection }, // C helm
        { 51224, WarriorProtection }, // C shoulders
        { 51220, WarriorProtection }, // C chest
        { 51222, WarriorProtection }, // C hands
        { 51223, WarriorProtection }, // C legs
    };
}
