using System.Collections.Generic;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        // sourceItemId -> [itemId1, ..., itemIdN]
        public static readonly Dictionary<int, int[]> ItemExpansions = new()
        {
            //{ , new[] { } }, // 
            
            // Siege of Orgrimmar
            { 99678, new[] { 99052, 99004, 99056 } }, // Conqueror Chest [L]
            { 99743, new[] { 99566, 99627, 99570 } }, // Conqueror Chest [N]
            { 99686, new[] { 99136, 99110, 99204 } }, // Conqueror Chest [H]
            { 99715, new[] { 99387, 99362, 99416 } }, // Conqueror Chest [M]

            { 99679, new[] { 99063, 98992, 99085, 99047 } }, // Protector Chest [L]
            { 99744, new[] { 99643, 99615, 99577, 99603 } }, // Protector Chest [N]
            { 99691, new[] { 99140, 99101, 99167, 99197 } }, // Protector Chest [H]
            { 99716, new[] { 99382, 99347, 99405, 99411 } }, // Protector Chest [M]
            
            { 99677, new[] { 99078, 99041, 99006, 99066 } }, // Vanquisher Chest [L]
            { 99742, new[] { 99658, 99632, 99629, 99608 } }, // Vanquisher Chest [N]
            { 99696, new[] { 99152, 99180, 99112, 99192 } }, // Vanquisher Chest [H]
            { 99714, new[] { 99400, 99326, 99356, 99335 } }, // Vanquisher Chest [M]
            
            { 99681, new[] { 99053, 99019, 99002 } }, // Conqueror Gloves [L]
            { 99746, new[] { 99567, 99586, 99625 } }, // Conqueror Gloves [N]
            { 99687, new[] { 99096, 99121, 99137 } }, // Conqueror Gloves [H]
            { 99721, new[] { 99424, 99359, 99380 } }, // Conqueror Gloves [M]
            
            { 99667, new[] { 99064, 99088, 99086, 99034 } }, // Protector Gloves [L]
            { 99747, new[] { 99644, 99580, 99578, 99559 } }, // Protector Gloves [N]
            { 99692, new[] { 99141, 99092, 99168, 99198 } }, // Protector Gloves [H]
            { 99722, new[] { 99383, 99345, 99406, 99412 } }, // Protector Gloves [M]
            
            { 99680, new[] { 99083, 99007, 98994, 99067 } }, // Vanquisher Gloves [L]
            { 99745, new[] { 99575, 99630, 99617, 99609 } }, // Vanquisher Gloves [N]
            { 99682, new[] { 99160, 99113, 99174, 99193 } }, // Vanquisher Gloves [H]
            { 99720, new[] { 99397, 99355, 99432, 99336 } }, // Vanquisher Gloves [M]
        };
    }
}
