using System.Collections.Generic;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Data
{
    public static partial class Hardcoded
    {
        public static readonly Dictionary<int, int> ArmorSubclassCharacterMask = new()
        {
            { 1, (int)(WowCharacterClassMask.Mage |
                       WowCharacterClassMask.Priest |
                       WowCharacterClassMask.Warlock) }, // Cloth
            
            { 2, (int)(WowCharacterClassMask.DemonHunter |
                       WowCharacterClassMask.Druid |
                       WowCharacterClassMask.Monk |
                       WowCharacterClassMask.Rogue) }, // Leather
            
            { 3, (int)(WowCharacterClassMask.Hunter |
                       WowCharacterClassMask.Shaman) }, // Mail
            
            { 4, (int)(WowCharacterClassMask.DeathKnight |
                       WowCharacterClassMask.Paladin |
                       WowCharacterClassMask.Warrior) }, // Plate
        };
    }
}
