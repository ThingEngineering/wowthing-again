using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using Serilog;
using Wowthing.Backend.Models.Data;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Backend.Utilities
{
    public static class DataUtilities
    {
#if DEBUG
        public static readonly string DataPath = Path.Join("..", "..", "data");
#else
        public static readonly string DataPath = "data";
#endif

        private static readonly IDeserializer _yaml = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .IgnoreUnmatchedProperties()
            .Build();

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
        
        public static List<List<TCategory>> LoadData<TCategory>(string basePath, ILogger logger = null)
            where TCategory : class?, ICloneable, IDataCategory
        {
            var categories = new List<List<TCategory>>();
            var cache = new Dictionary<string, TCategory>();

            basePath = Path.Join(DataPath, basePath);
            var orderFile = Path.Join(basePath, "_order");
            
            logger?.Debug("Loading {0}", orderFile);

            var inGlobal = false;
            List<string> globalFiles = new();
            List<TCategory> things = null;
            foreach (var line in File.ReadLines(Path.Join(basePath, "_order")))
            {
                if (line == "*")
                {
                    inGlobal = true;
                    continue;
                }
                
                if (line.Trim() == "")
                {
                    inGlobal = false;
                    continue;
                }

                if (inGlobal)
                {
                    globalFiles.Add(line.Trim());
                    continue;
                }
                
                // Separator
                if (line == "-")
                {
                    if (things != null)
                    {
                        categories.Add(things);
                        things = null;
                    }
                    categories.Add(null);
                }
                else if (line.StartsWith("    "))
                {
                    var trimmed = line.Trim();
                    if (trimmed == "-")
                    {
                        things.Add(null);
                    }
                    else
                    {
                        // Subgroup
                        logger?.Debug("Loading subgroup: {0}", trimmed);
                        things.Add(LoadFile(basePath, trimmed, cache));
                    }
                }
                else
                {
                    // Group
                    if (things != null)
                    {
                        categories.Add(things);
                    }

                    logger?.Debug("Loading group: {0}", line.Trim());
                    things = new List<TCategory>
                    {
                        LoadFile(basePath, line, cache),
                    };

                    if (line.Contains("/"))
                    {
                        var linePath = line.Split("/")[0];
                        foreach (var globalFile in globalFiles)
                        {
                            var globalFilePath = Path.Join(linePath, globalFile);
                            if (File.Exists(Path.Join(basePath, globalFilePath)))
                            {
                                logger?.Debug("Loading autogroup: {0}", globalFilePath);
                                things.Add(LoadFile(basePath, globalFilePath, cache));
                            }
                        }
                    } 
                }
            }

            if (things != null)
            {
                categories.Add(things);
            }

            return categories;
        }

        private static TCategory LoadFile<TCategory>(string basePath, string line,
            Dictionary<string, TCategory> categoryCache)
            where TCategory : ICloneable, IDataCategory
        {
            var parts = line.Trim().Split(' ', 2);
            var filePath = Path.Join(basePath, parts[0]);

            if (!categoryCache.TryGetValue(filePath, out TCategory cat))
            {
                //Logger.Debug("Loading {0}", parts[0]);
                cat = categoryCache[filePath] = _yaml.Deserialize<TCategory>(File.OpenText(filePath));
            }
            
            if (parts.Length == 2)
            {
                cat = (TCategory)cat.Clone();
                cat.Name = parts[1];
            }

            return cat;
        }
    }
}
