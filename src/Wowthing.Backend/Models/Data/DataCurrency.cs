namespace Wowthing.Backend.Models.Data
{
    public class DataCurrency
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int MaxPerWeek { get; set; }
        public int MaxTotal { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }

        public DataCurrency(DumpCurrencyTypes currencyType)
        {
            Id = currencyType.Id;
            CategoryId = currencyType.CategoryId;
            MaxPerWeek = currencyType.MaxEarnablePerWeek;
            MaxTotal = currencyType.MaxQty;
            Description = currencyType.Description;
            Name = currencyType.Name;
        }
    }
}
