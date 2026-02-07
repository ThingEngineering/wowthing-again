using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowHoliday
{
    [Key]
    public short Id { get; set; }

    public short DescriptionId { get; set; }
    public short NameId { get; set; }

    public short FilterType { get; set; }
    public short Flags { get; set; }
    public short Looping { get; set; }
    public short Priority { get; set; }
    public short Region { get; set; }

    public List<short> Durations { get; set; }
    public List<DateTime> StartDates { get; set; }

    public WowHoliday(short id)
    {
        Id = id;
    }
}
