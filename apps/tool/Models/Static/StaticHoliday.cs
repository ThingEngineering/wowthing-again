using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticHolidayConverter))]
public class StaticHoliday : WowHoliday
{
    public string Name { get; set; }

    public StaticHoliday(WowHoliday holiday) : base(holiday.Id)
    {
        FilterType = holiday.FilterType;
        Flags = holiday.Flags;
        Looping = holiday.Looping;
        Priority = holiday.Priority;
        Region = holiday.Region;
        Durations = holiday.Durations;
        StartDates = holiday.StartDates;
    }
}
