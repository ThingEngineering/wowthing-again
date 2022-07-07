using System.ComponentModel.DataAnnotations;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowCharacterSpecialization
{
    [Key]
    public short Id { get; set; }

    public short ClassId { get; set; }
    public short Order { get; set; }
    public WowRole Role { get; set; }
    public WowStat PrimaryStat { get; set; }
}
