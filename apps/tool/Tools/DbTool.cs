using Serilog.Context;
using Wowthing.Tool.Extensions;
using Wowthing.Tool.Models.Db;

namespace Wowthing.Tool.Tools;

public class DbTool
{
    private readonly JankTimer _timer = new();

    private int _mapIndex = 1;
    private int _requirementIndex = 1;
    private int _tagIndex = 1;
    private readonly Dictionary<string, int> _mapToId = new();
    private readonly Dictionary<string, int> _requirementToId = new();
    private readonly Dictionary<string, int> _tagToId = new();

    private readonly List<OutDbThing> _things = new();

    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Db");
        await using var context = ToolContext.GetDbContext();

        ToolContext.Logger.Information("Loading...");

        LoadDbFiles();

        _timer.AddPoint("Load");

        var outData = new RedisDbData()
        {
            MapsById = _mapToId.ToReverseDictionary(),
            RequirementsById = _requirementToId.ToReverseDictionary(),
            TagsById = _tagToId.ToReverseDictionary(),

            RawThings = _things
                .OrderBy(thing => thing.Type)
                .ThenBy(thing => thing.Id)
                .ToArray(),
        };

        // Save the data to Redis
        ToolContext.Logger.Information("Saving...");

        string cacheJson = ToolContext.SerializeJson(outData); // cacheData
        string cacheHash = cacheJson.Md5();
        _timer.AddPoint("JSON");

        var db = ToolContext.Redis.GetDatabase();

        foreach (var language in Enum.GetValues<Language>())
        {
            await db.SetCacheDataAndHash($"db-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Save", true);

        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private void LoadDbFiles()
    {
        ToolContext.Logger.Information("📁_db/");
        var rootDirInfo = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "_db"));
        RecurseDirectory(rootDirInfo, 0, null, new HashSet<int>(), new HashSet<int>());
    }

    private void RecurseDirectory(
        DirectoryInfo dirInfo,
        int depth,
        string? baseLocation,
        HashSet<int>? requirementIds,
        HashSet<int>? tagIds
    )
    {
        string indent = new string(' ', ++depth * 2);
        var dirRequirementIds = new HashSet<int>(requirementIds);
        var dirTagIds = new HashSet<int>(tagIds);

        var fileInfos = dirInfo.GetFiles()
            .OrderBy(fi => fi.Name)
            .ToArray();
        foreach (var fileInfo in fileInfos)
        {
            ToolContext.Logger.Information("{indent}📄{fileName}", indent, fileInfo.Name);
            var parsed = DataUtilities.YamlDeserializer.Deserialize<DataDbFile>(File.OpenText(fileInfo.FullName));
            if (fileInfo.Name == "_.yml")
            {
                baseLocation = parsed.Location;
                AddRequirements(dirRequirementIds, parsed.Requirements);
                AddTags(dirTagIds, parsed.Tags);
            }
            else
            {
                ProcessFile(parsed, baseLocation, new HashSet<int>(dirRequirementIds), new HashSet<int>(dirTagIds));
            }
        }

        var dirInfos = dirInfo.GetDirectories()
            .OrderBy(di => di.Name)
            .ToArray();
        foreach (var subDirInfo in dirInfos)
        {
            ToolContext.Logger.Information("{indent}📁{dirName}/", indent, subDirInfo.Name);
            RecurseDirectory(subDirInfo, depth, baseLocation, new HashSet<int>(dirRequirementIds), new HashSet<int>(dirTagIds));
        }
    }

    private void ProcessFile(DataDbFile parsed, string? baseLocation, HashSet<int> fileRequirementIds, HashSet<int> fileTagIds)
    {
        AddRequirements(fileRequirementIds, parsed.Requirements);
        AddTags(fileTagIds, parsed.Tags);

        if (!string.IsNullOrEmpty(parsed.Location))
        {
            baseLocation = parsed.Location;
        }

        foreach (var dataThing in parsed.Things.EmptyIfNull())
        {
            var thingRequirementIds = new HashSet<int>(fileRequirementIds);
            AddRequirements(thingRequirementIds, dataThing.Requirements);

            var thingTagIds = new HashSet<int>(fileTagIds);
            AddTags(thingTagIds, dataThing.Tags);

            var outThing = new OutDbThing(dataThing, thingRequirementIds, thingTagIds);

            // Locations
            foreach ((string mapName, var locations) in dataThing.Locations.EmptyIfNull())
            {
                int mapId = AddMap(mapName == "here" && baseLocation != null ? baseLocation : mapName);
                foreach (string locationString in locations.EmptyIfNull())
                {
                    outThing.AddLocation(mapId, locationString);
                }
            }

            // Contents
            foreach (var dataContent in dataThing.Contents.EmptyIfNull())
            {
                var contentRequirementIds = new HashSet<int>();
                AddRequirements(contentRequirementIds, dataContent.Requirements);

                var contentTagIds = new HashSet<int>();
                foreach (string requirementString in dataContent.Requirements.EmptyIfNull())
                {
                    string[] requirementParts = requirementString.Split(' ');
                    if (requirementParts is ["profession", _, ..])
                    {
                        AddTags(contentTagIds, new [] { $"{requirementParts[0]}:{requirementParts[1]}" });
                    }
                }

                var outContent = new OutDbThingContent(dataContent, contentRequirementIds, contentTagIds);
                outThing.Contents.Add(outContent);
            }

            _things.Add(outThing);
        }
    }

    private int AddMap(string mapName)
    {
        if (!_mapToId.ContainsKey(mapName))
        {
            _mapToId[mapName] = _mapIndex++;
        }

        return _mapToId[mapName];
    }

    private void AddRequirements(HashSet<int> requirementIds, IEnumerable<string>? requirementStrings)
    {
        if (requirementStrings == null)
        {
            return;
        }

        foreach (string requirementString in requirementStrings)
        {
            if (!_requirementToId.ContainsKey(requirementString))
            {
                _requirementToId[requirementString] = _requirementIndex++;
            }

            requirementIds.Add(_requirementToId[requirementString]);
        }
    }

    private void AddTags(HashSet<int> tagIds, IEnumerable<string>? tagStrings)
    {
        if (tagStrings == null)
        {
            return;
        }

        foreach (string tagString in tagStrings)
        {
            if (!_tagToId.ContainsKey(tagString))
            {
                _tagToId[tagString] = _tagIndex++;
            }

            tagIds.Add(_tagToId[tagString]);
        }
    }
}
