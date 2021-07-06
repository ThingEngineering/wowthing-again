using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data
{
    public class DataCurrencyCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Slug => Name.Slugify();

        public DataCurrencyCategory(DumpCurrencyCategory currencyCategory)
        {
            Id = currencyCategory.Id;
            Name = currencyCategory.Name;
        }
    }
}
