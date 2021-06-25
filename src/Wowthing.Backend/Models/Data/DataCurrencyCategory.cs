using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            Id = currencyCategory.ID;
            Name = currencyCategory.Name;
        }
    }
}
