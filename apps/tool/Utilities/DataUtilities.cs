using System.Diagnostics;
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using Serilog;
using Wowthing.Tool.Models;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace Wowthing.Tool.Utilities;

public static class DataUtilities
{
    public static string DataPath => ResolvePath(Environment.GetEnvironmentVariable("WOWTHING_DATA_PATH")!);
    public static string DumpsPath => ResolvePath(Environment.GetEnvironmentVariable("WOWTHING_DUMP_PATH")!);

    private static string ResolvePath(string path)
    {
        if (path.StartsWith("~/"))
        {
            path = $"{Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)}/{path[2..]}";
        }

        return path;
    }

    public static readonly IDeserializer YamlDeserializer = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .IgnoreUnmatchedProperties()
        .Build();

    public static async Task<List<T>> LoadDumpCsvAsync<T>(
        string fileName,
        Language language = Language.enUS,
        Func<T, bool>? validFunc = null,
        bool skipValidation = false
    )
    {
        string filePath = Path.Join(DumpsPath, language.ToString(), fileName + ".csv");

        var config = new CsvConfiguration(CultureInfo.InvariantCulture);
        if (skipValidation)
        {
             config.HeaderValidated = null;
             config.MissingFieldFound = null;
        }

        using var reader = new StreamReader(filePath);
        using var csvReader = new CsvReader(reader, config);

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

    public static async Task<List<T>> LoadGameTableAsync<T>(string fileName)
    {
        string filePath = Path.Join(DumpsPath, "GameTables", fileName + ".txt");
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            DetectDelimiter = true,
        };

        using var reader = new StreamReader(filePath);
        using var csvReader = new CsvReader(reader, config);

        var ret = new List<T>();
        await foreach (var record in csvReader.GetRecordsAsync<T>())
        {
            ret.Add(record);
        }
        return ret;
    }

    public static async Task<Dictionary<TKey, TValue>> LoadDumpToDictionaryAsync<TKey, TValue>(
        string fileName,
        Func<TValue, TKey> keyFunc,
        Language language = Language.enUS,
        Func<TValue, bool>? validFunc = null,
        bool skipValidation = false
    ) where TKey : notnull
    {
        var records = await LoadDumpCsvAsync<TValue>(fileName, language, validFunc, skipValidation);
        return records.ToDictionary(keyFunc);
    }

    public static List<List<TCategory?>?> LoadData<TCategory>(string basePath, ILogger? logger = null)
        where TCategory : class, ICloneable, IDataCategory
    {
        var categories = new List<List<TCategory>>();
        var cache = new Dictionary<string, TCategory>();

        basePath = Path.Join(DataPath, basePath);
        var orderFile = Path.Join(basePath, "_order");
        logger?.Debug("Loading {0}", orderFile);

        bool inGlobal = false;
        List<string> globalFiles = new();
        List<TCategory>? things = null;
        foreach (var line in File.ReadLines(orderFile))
        {
            if (line.StartsWith('#'))
            {
                continue;
            }

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
                categories.Add(null!);
            }
            else if (line.StartsWith("    "))
            {
                Debug.Assert(things != null);

                var trimmed = line.Trim();
                if (trimmed == "-")
                {
                    things.Add(null!);
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

                            var last = things.Last();
                            last.Name = ">" + last.Name;
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

    public static List<TCategory?> LoadDataNested<TCategory>(string basePath, ILogger? logger = null)
        where TCategory : class, ICloneable, IDataCategoryNested<TCategory>
    {
        var categories = new List<TCategory?>();
        var cache = new Dictionary<string, TCategory>();

        basePath = Path.Join(DataPath, basePath);
        var orderFile = Path.Join(basePath, "_order");
        logger?.Debug("Loading {0}", orderFile);

        bool inGlobal = false;
        List<string> globalFiles = new();
        TCategory? rootThing = null;
        foreach (var line in File.ReadLines(orderFile))
        {
            if (line.StartsWith('#'))
            {
                continue;
            }

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
                if (rootThing != null)
                {
                    categories.Add(rootThing);
                    rootThing = null;
                }
                categories.Add(null!);
            }
            else if (line.StartsWith("        "))
            {
                Debug.Assert(rootThing != null);

                string trimmed = line.Trim();
                rootThing.Children.Last().Children.Add(LoadFile(basePath, trimmed, cache));
            }
            else if (line.StartsWith("    "))
            {
                Debug.Assert(rootThing != null);

                string trimmed = line.Trim();
                if (trimmed == "-")
                {
                    rootThing.Children.Add(null!);
                }
                else
                {
                    // Subgroup
                    logger?.Debug("Loading subgroup: {0}", trimmed);
                    rootThing.Children.Add(LoadFile(basePath, trimmed, cache));
                }
            }
            else
            {
                // Group
                if (rootThing != null)
                {
                    categories.Add(rootThing);
                }

                logger?.Debug("Loading group: {0}", line.Trim());
                rootThing = LoadFile(basePath, line, cache);

                if (line.Contains('/'))
                {
                    string linePath = line.Split("/")[0];
                    foreach (var globalFile in globalFiles)
                    {
                        string globalFilePath = Path.Join(linePath, globalFile);
                        if (File.Exists(Path.Join(basePath, globalFilePath)))
                        {
                            logger?.Debug("Loading autogroup: {0}", globalFilePath);
                            rootThing.Children.Add(LoadFile(basePath, globalFilePath, cache));

                            var lastThing = rootThing.Children.Last();
                            lastThing.Name = ">" + lastThing.Name;
                        }
                    }
                }
            }
        }

        if (rootThing != null)
        {
            categories.Add(rootThing);
        }

        return categories;
    }

    private static TCategory LoadFile<TCategory>(string basePath, string line,
        Dictionary<string, TCategory> categoryCache)
        where TCategory : ICloneable, IDataCategory
    {
        var parts = line.Trim().Split(' ', 2);
        var filePath = Path.Join(basePath, parts[0]);

        if (!categoryCache.TryGetValue(filePath, out TCategory? cat))
        {
            //Logger.Debug("Loading {0}", parts[0]);
            cat = categoryCache[filePath] = YamlDeserializer.Deserialize<TCategory>(File.OpenText(filePath));
        }

        if (parts.Length == 2)
        {
            cat = (TCategory)cat.Clone();
            cat.Name = parts[1];
        }

        return cat;
    }

    public static Dictionary<int, int[]> LoadItemExpansions()
    {
        var di = new DirectoryInfo(Path.Join(DataPath, "_shared", "item-expansion"));
        var files = di.GetFiles("*.yml", SearchOption.AllDirectories)
            .OrderBy(file => file.FullName)
            .ToArray();

        var ret = new Dictionary<int, int[]>();

        foreach (var file in files)
        {
            var items = YamlDeserializer.Deserialize<Dictionary<int, int[]>>(File.OpenText(file.FullName));
            foreach (var (itemId, expandedIds) in items)
            {
                ret[itemId] = expandedIds;
            }
        }

        return ret;
    }
}
