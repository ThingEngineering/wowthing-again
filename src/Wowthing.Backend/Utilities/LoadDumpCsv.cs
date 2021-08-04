using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;

namespace Wowthing.Backend.Utilities
{
    public static class CsvUtilities
    {
#if DEBUG
        public static readonly string DataPath = Path.Join("..", "..", "data");
#else
        public static readonly string DataPath = "data";
#endif

        public static async Task<List<T>> LoadDumpCsvAsync<T>(string fileName, Func<T, bool> validFunc = null)
        {
            var basePath = Path.Join(DataPath, "dumps");
            var filePath = Directory.GetFiles(basePath, $"{fileName}-*.csv").OrderByDescending(f => f).First();

            var csvReader = new CsvReader(File.OpenText(filePath), CultureInfo.InvariantCulture);

            var ret = new List<T>();
            await foreach (T record in csvReader.GetRecordsAsync<T>())
            {
                if (validFunc == null || validFunc(record))
                {
                    ret.Add(record);
                }
            }
            return ret;
        }

    }
}
