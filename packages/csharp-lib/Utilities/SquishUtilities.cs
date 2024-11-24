namespace Wowthing.Lib.Utilities;

public static class SquishUtilities
{
    // This probably doesn't really belong here, but adding an entire new service for it seemed silly
    private const string CharValues =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[{]};:,<.>/?";

    private static Dictionary<char, int> _squishedCharMap;
    private static Dictionary<char, int> SquishedCharMap
    {
        get
        {
            _squishedCharMap ??= CharValues.Select((chr, index) => (chr, index))
                .ToDictionary(tup => tup.chr, tup => tup.index + 1);
            return _squishedCharMap;
        }
    }

    public static List<int> Unsquish(string squished)
    {
        var ret = new List<int>();

        // questId(.deltas)|...
        foreach (string part in squished.EmptyIfNullOrWhitespace().Split('|').Where(s => !string.IsNullOrEmpty(s)))
        {
            string[] questParts = part.Split('.', 2);
            if (!int.TryParse(questParts[0], out int questId))
            {
                continue;
            }

            ret.Add(questId);

            if (questParts.Length == 2)
            {
                foreach (char deltaChar in questParts[1].EmptyIfNullOrWhitespace())
                {
                    questId += SquishedCharMap[deltaChar];
                    ret.Add(questId);
                }
            }
        }

        return ret;
    }
}
