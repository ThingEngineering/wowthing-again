using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow
{
    public class WowItem
    {
        [Key]
        public int Id { get; set; }
        public int ClassMask { get; set; }
        public long RaceMask { get; set; }
        public int Stackable { get; set; }
        public short ClassId { get; set; }
        public short SubclassId { get; set; }
        public WowInventoryType InventoryType { get; set; }
        public short ContainerSlots { get; set; }
        public WowQuality Quality { get; set; }
        public WowStat PrimaryStat { get; set; }

        public int GetCalculatedClassMask(bool legacyLoot = false)
        {
            if (ClassMask > 0)
            {
                return ClassMask;
            }

            int classMask = 0;
            var itemStats = new HashSet<WowStat>(Hardcoded.StatToStats[PrimaryStat]);

            // Weapons
            if (ClassId == 2)
            {
                foreach (var classData in Hardcoded.Characters)
                {
                    if (classData.WeaponTypes
                        .Any((t =>
                                (short)t.Item1 == SubclassId &&
                                (
                                    PrimaryStat == WowStat.None ||
                                    legacyLoot ||
                                    (
                                        itemStats.Count > 0 && 
                                        t.Item2.Any(stat => itemStats.Contains(stat))
                                    )
                                )
                            )))
                    {
                        classMask |= (int)classData.Mask;
                    }
                }
            }
            // Armor types
            else if (ClassId == 4 && Hardcoded.ArmorSubclassCharacterMask.TryGetValue(SubclassId, out int armorMask))
            {
                classMask = armorMask;
            }
            else if (ClassId == 4 && PrimaryStat != WowStat.None)
            {
                foreach (var classData in Hardcoded.Characters)
                {
                    if (classData.ArmorTypes
                        .Any((t =>
                                (int)t.Item1 == SubclassId &&
                                (
                                    PrimaryStat == WowStat.None ||
                                    legacyLoot ||
                                    (
                                        itemStats.Count > 0 &&
                                        t.Item2.Any(stat => itemStats.Contains(stat))
                                    )
                                )
                            )
                    )
                    )
                    {
                        classMask |= (int)classData.Mask;
                    }
                }
            }

            return classMask;
        }
    }
}
