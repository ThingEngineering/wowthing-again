using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Backend.Models.Data
{
    public class DataCurrency
    {
        public int CategoryID { get; set; }
        public int MaxPerWeek { get; set; }
        public int MaxTotal { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }

        public DataCurrency(DumpCurrencyTypes currencyType)
        {
            CategoryID = currencyType.CategoryID;
            MaxPerWeek = currencyType.MaxEarnablePerWeek;
            MaxTotal = currencyType.MaxQty;
            Description = currencyType.Description;
            Name = currencyType.Name;
        }
    }
}
