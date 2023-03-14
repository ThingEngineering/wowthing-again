using Wowthing.Lib.Constants;

namespace Wowthing.Tool.Utilities;

public static class DateTimeUtilities
{
    private const int MINUTES_MASK      = 0b0000_0000_0000_0000_0000_0000_0011_1111;
    private const int HOURS_MASK        = 0b0000_0000_0000_0000_0000_0111_1100_0000;
    private const int DAY_OF_WEEK_MASK  = 0b0000_0000_0000_0000_0011_1000_0000_0000;
    private const int DAY_OF_MONTH_MASK = 0b0000_0000_0000_1111_1100_0000_0000_0000;
    private const int MONTH_MASK        = 0b0000_0000_1111_0000_0000_0000_0000_0000;
    private const int YEAR_MASK         = 0b0001_1111_0000_0000_0000_0000_0000_0000;
    private const int TIMEZONE_MASK     = 0b0110_0000_0000_0000_0000_0000_0000_0000;

    public static DateTime ParseBlizzardDateTime(int ugh)
    {
        if (ugh == 0)
        {
            return MiscConstants.DefaultDateTime;
        }

        int minutes = ugh & MINUTES_MASK;
        int hours = (ugh & HOURS_MASK) >> 6;
        int dayOfWeek = (ugh & DAY_OF_WEEK_MASK) >> 11;
        int dayOfMonth = (ugh & DAY_OF_MONTH_MASK) >> 14;
        int month = (ugh & MONTH_MASK) >> 20;
        int year = (ugh & YEAR_MASK) >> 24;
        int timezone = (ugh & TIMEZONE_MASK) >> 29; // TODO

        try
        {
            return new DateTime(
                2000 + year,
                01 + month,
                01 + dayOfMonth,
                hours,
                minutes,
                0,
                DateTimeKind.Utc
            );
        }
        catch (ArgumentOutOfRangeException)
        {
            return MiscConstants.DefaultDateTime;
        }
    }
}
