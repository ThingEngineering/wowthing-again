using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class LanguageString
    {
        public Language Language { get; set; }
        public StringType Type { get; set; }
        public int Id { get; set; }
        public string String { get; set; }
    }
}
