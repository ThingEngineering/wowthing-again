namespace Wowthing.Tool.Data;

public static partial class Hardcoded
{
    private static readonly int[] FirstSoulbind = {
        0,
        0,
        3,
        7,
        10,
        21,
        25,
        30,
        43,
        46,
        51,
        55,
    };
    private static readonly int[] SecondSoulbind =
    {
        0,
        0,
        0,
        9,
        13,
        18,
        28,
        34,
        42,
        45,
        49,
        54,
    };
    private static readonly int[] ThirdSoulbind =
    {
        0,
        0,
        0,
        0,
        0,
        0,
        29,
        31,
        41,
        48,
        53,
        57,
    };

        
    public static readonly Dictionary<int, int[]> SoulbindRenown = new()
    {
        // Kyrian
        { 7, FirstSoulbind }, // Pelagos
        { 13, SecondSoulbind }, // Kleia
        { 18, ThirdSoulbind }, // Forgelite Prime Mikanikos
            
        // Necrolord
        { 4, new[] // Plague Deviser Marileth
        {
            0,
            0,
            3,
            9, // But why?
            10,
            21,
            25,
            30,
            43,
            46,
            51,
            55,
        }},
        { 5, new[] // Emeni
        {
            0,
            0,
            0,
            7,
            13,
            18,
            28,
            34,
            42,
            45,
            49,
            54,
        }},
        { 10, ThirdSoulbind }, // Bonesmith Heirmir
            
        // Night Fae
        { 1, new[] { // Niya
            0,
            0,
            3,
            7,
            10,
            18, // But why?
            25,
            30,
            43,
            46,
            51,
            55,
        }},
        { 2, new[] // Dreamweaver
        {
            0,
            0,
            0,
            9,
            13,
            21,
            29,
            34,
            42,
            45,
            49,
            54,
        }},
        { 6, new[] // Korayn
        {
            0,
            0,
            0,
            0,
            0,
            0,
            28, // But why?
            31,
            41,
            48,
            53,
            57,
        }},

        // Venthyr
        { 8, FirstSoulbind }, // Nadjia the Mistblade
        { 9, SecondSoulbind }, // Theotar the Mad Duke
        { 3, ThirdSoulbind }, // General Draven
    };
}