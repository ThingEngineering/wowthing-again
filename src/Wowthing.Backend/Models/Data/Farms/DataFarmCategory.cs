using System;
using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Farms
{
    public class DataFarmCategory : IDataCategory, ICloneable
    {
        public int MinimumLevel { get; set; }
        public string Name { get; set; }
        public List<DataFarmFarm> Farms { get; set; }

        public object Clone()
        {
            return new DataFarmCategory
            {
                Name = (string)Name.Clone(),
                Farms = Farms,
            };
        }
    }
}
