using Wowthing.Lib.Converters;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Models.Static;

[System.Text.Json.Serialization.JsonConverter(typeof(StaticHolidayConverter))]
public class StaticHoliday : WowHoliday
{
    public string Name { get; set; }

    public StaticHoliday(WowHoliday holiday)
    {
        Id = holiday.Id;
        FilterType = holiday.FilterType;
        Flags = holiday.Flags;
        Looping = holiday.Looping;
        Priority = holiday.Priority;
        Region = holiday.Region;
        Durations = holiday.Durations;
        StartDates = holiday.StartDates;
    }
}
