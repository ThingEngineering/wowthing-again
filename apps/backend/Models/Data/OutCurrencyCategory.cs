namespace Wowthing.Backend.Models.Data
{
    public class OutCurrencyCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Slug => Name.Slugify();

        public OutCurrencyCategory(DumpCurrencyCategory currencyCategory)
        {
            Id = currencyCategory.ID;
            Name = currencyCategory.Name;
        }
    }
}
