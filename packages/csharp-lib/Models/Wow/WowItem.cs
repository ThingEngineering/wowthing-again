using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Data;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowItem
{
    [Key]
    public int Id { get; set; }
    public int ClassMask { get; set; }
    public long RaceMask { get; set; }
    public int OppositeFactionId { get; set; }
    public int RequiredAbility { get; set; }
    public int Stackable { get; set; }
    public short ClassId { get; set; }
    public short SubclassId { get; set; }
    public WowInventoryType InventoryType { get; set; }
    public short ContainerSlots { get; set; }
    public WowQuality Quality { get; set; }
    public WowStat PrimaryStat { get; set; }
    public WowItemFlags Flags { get; set; }
    public short Expansion { get; set; }
    public short ItemLevel { get; set; }
    public short RequiredLevel { get; set; }
    public WowBindType BindType { get; set; }
    public short Unique { get; set; }
    public short RequiredSkill { get; set; }
    public short RequiredSkillRank { get; set; }
    public short LimitCategory { get; set; }
    public short CraftingQuality { get; set; }

    [Required]
    public short[] Sockets { get; set; } = [];

    [Required]
    public int[] CompletesQuestIds { get; set; } = [];

    [Required]
    public int[] TeachesDecorIds { get; set; } = [];

    [Required]
    public int[] TeachesSpellIds { get; set; } = [];

    [Required]
    public int[] TeachesTransmogIllusionIds { get; set; } = [];

    [Required]
    public int[] TeachesTransmogSetIds { get; set; } = [];

    public WowItem(int id)
    {
        Id = id;
    }

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
                    .Any(t =>
                        (short)t.Item1 == SubclassId &&
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
        else if (ClassId == 4)
        {
            foreach (var classData in Hardcoded.Characters)
            {
                if (classData.ArmorTypes
                    .EmptyIfNull()
                    .Any(t =>
                        (short)t.Item1 == SubclassId &&
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
                {
                    classMask |= (int)classData.Mask;
                }
            }
        }

        return classMask;
    }
}
