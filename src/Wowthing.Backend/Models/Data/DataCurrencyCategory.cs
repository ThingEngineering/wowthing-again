using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Backend.Models.Data
{
    public class DataCurrencyCategory
    {
        public string Name { get; set; }

        public DataCurrencyCategory(DumpCurrencyCategory currencyCategory)
        {
            Name = currencyCategory.Name;
        }
    }
}
