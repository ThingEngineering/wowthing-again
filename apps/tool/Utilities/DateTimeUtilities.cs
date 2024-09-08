using System.Diagnostics;
using Wowthing.Lib.Constants;

namespace Wowthing.Tool.Utilities;

public static class DateTimeUtilities
{
    private const int MinutesMask    = 0b0000_0000_0000_0000_0000_0000_0011_1111;
    private const int HoursMask      = 0b0000_0000_0000_0000_0000_0111_1100_0000;
    // private const int DayOfWeekMask  = 0b0000_0000_0000_0000_0011_1000_0000_0000;
    private const int DayOfMonthMask = 0b0000_0000_0000_1111_1100_0000_0000_0000;
    private const int MonthMask      = 0b0000_0000_1111_0000_0000_0000_0000_0000;
    private const int YearMask       = 0b0001_1111_0000_0000_0000_0000_0000_0000;
    private const int TimezoneMask   = 0b0110_0000_0000_0000_0000_0000_0000_0000;

    public static DateTime ParseBlizzardDateTime(int ugh)
    {
        if (ugh == 0)
        {
            return MiscConstants.DefaultDateTime;
        }

        int minutes = ugh & MinutesMask;
        int hours = (ugh & HoursMask) >> 6;
        // int dayOfWeek = (ugh & DayOfWeekMask) >> 11;
        int dayOfMonth = (ugh & DayOfMonthMask) >> 14;
        int month = (ugh & MonthMask) >> 20;
        int year = (ugh & YearMask) >> 24;
        int timezone = (ugh & TimezoneMask) >> 29;

        Debug.Assert(timezone == 0);

        try
        {
            var dateTime = new DateTime(
                2000 + year,
                01 + month,
                01 + dayOfMonth,
                hours,
                minutes,
                0,
                DateTimeKind.Utc
            );
            // timezone 0 is Blizzard Time™ which is actually -7, fudge it
            return dateTime.AddHours(7);
        }
        catch (ArgumentOutOfRangeException)
        {
            return MiscConstants.DefaultDateTime;
        }
    }
}
