using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Holidays;

// ReSharper disable InconsistentNaming
public class DumpHolidays
{
    public short ID { get; set; }

    public short CalendarFilterType { get; set; }
    public short Flags { get; set; }
    public short HolidayNameID { get; set; }
    public short Looping { get; set; }
    public short Priority { get; set; }
    public short Region { get; set; }

    [Name("Date[0]")]
    public int Date0 { get; set; }

    [Name("Date[1]")]
    public int Date1 { get; set; }

    [Name("Date[2]")]
    public int Date2 { get; set; }

    [Name("Date[3]")]
    public int Date3 { get; set; }

    [Name("Date[4]")]
    public int Date4 { get; set; }

    [Name("Date[5]")]
    public int Date5 { get; set; }

    [Name("Date[6]")]
    public int Date6 { get; set; }

    [Name("Date[7]")]
    public int Date7 { get; set; }

    [Name("Date[8]")]
    public int Date8 { get; set; }

    [Name("Date[9]")]
    public int Date9 { get; set; }

    [Name("Date[10]")]
    public int Date10 { get; set; }

    [Name("Date[11]")]
    public int Date11 { get; set; }

    [Name("Date[12]")]
    public int Date12 { get; set; }

    [Name("Date[13]")]
    public int Date13 { get; set; }

    [Name("Date[14]")]
    public int Date14 { get; set; }

    [Name("Date[15]")]
    public int Date15 { get; set; }

    [Name("Date[16]")]
    public int Date16 { get; set; }

    [Name("Date[17]")]
    public int Date17 { get; set; }

    [Name("Date[18]")]
    public int Date18 { get; set; }

    [Name("Date[19]")]
    public int Date19 { get; set; }

    [Name("Date[20]")]
    public int Date20 { get; set; }

    [Name("Date[21]")]
    public int Date21 { get; set; }

    [Name("Date[22]")]
    public int Date22 { get; set; }

    [Name("Date[23]")]
    public int Date23 { get; set; }

    [Name("Date[24]")]
    public int Date24 { get; set; }

    [Name("Date[25]")]
    public int Date25 { get; set; }

    [Name("Duration[0]")]
    public short Duration0 { get; set; }

    [Name("Duration[1]")]
    public short Duration1 { get; set; }

    [Name("Duration[2]")]
    public short Duration2 { get; set; }

    [Name("Duration[3]")]
    public short Duration3 { get; set; }

    [Name("Duration[4]")]
    public short Duration4 { get; set; }

    [Name("Duration[5]")]
    public short Duration5 { get; set; }

    [Name("Duration[6]")]
    public short Duration6 { get; set; }

    [Name("Duration[7]")]
    public short Duration7 { get; set; }

    [Name("Duration[8]")]
    public short Duration8 { get; set; }

    [Name("Duration[9]")]
    public short Duration9 { get; set; }

    public List<int> Dates => new()
    {
        Date0,
        Date1,
        Date2,
        Date3,
        Date4,
        Date5,
        Date6,
        Date7,
        Date8,
        Date9,
        Date10,
        Date11,
        Date12,
        Date13,
        Date14,
        Date15,
        Date16,
        Date17,
        Date18,
        Date19,
        Date20,
        Date21,
        Date22,
        Date23,
        Date24,
        Date25,
    };

    public List<short> Durations => new()
    {
        Duration0,
        Duration1,
        Duration2,
        Duration3,
        Duration4,
        Duration5,
        Duration6,
        Duration7,
        Duration8,
        Duration9,
    };
}
