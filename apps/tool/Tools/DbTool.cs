using Serilog.Context;
using Wowthing.Tool.Models.Db;

namespace Wowthing.Tool.Tools;

public class DbTool
{
    private readonly JankTimer _timer = new();

    private int _tagIndex = 1;
    private readonly Dictionary<string, int> _tagMap = new();
    private readonly List<DataDbThing> _things = new();

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Db");
        await using var context = ToolContext.GetDbContext();

        LoadDbFiles();

        _timer.AddPoint("Generate", true);
        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private void LoadDbFiles()
    {
        ToolContext.Logger.Information("📁_db/");
        var rootDirInfo = new DirectoryInfo(Path.Join(DataUtilities.DataPath, "_db"));
        RecurseDirectory(rootDirInfo, 0, new HashSet<int>());
    }

    private void RecurseDirectory(DirectoryInfo dirInfo, int depth, HashSet<int> tagIds)
    {
        string? baseLocation = null;
        string indent = new string(' ', ++depth * 2);
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
                AddTags(dirTagIds, parsed.Tags);
                baseLocation = parsed.Location;
            }
            else
            {
                var fileTagIds = new HashSet<int>(dirTagIds);
                AddTags(fileTagIds, parsed.Tags);

                ProcessFile(fileTagIds, baseLocation, parsed);

                ToolContext.Logger.Information("tags: {tags}", string.Join(',', fileTagIds));
            }
        }

        var dirInfos = dirInfo.GetDirectories()
            .OrderBy(di => di.Name)
            .ToArray();
        foreach (var subDirInfo in dirInfos)
        {
            ToolContext.Logger.Information("{indent}📁{dirName}/", indent, subDirInfo.Name);
            RecurseDirectory(subDirInfo, depth, new HashSet<int>(dirTagIds));
        }
    }

    private void ProcessFile(HashSet<int> fileTagIds, string? baseLocation, DataDbFile parsed)
    {
        foreach (var thing in parsed.Things.EmptyIfNull())
        {
            var thingTagIds = new HashSet<int>(fileTagIds);
            AddTags(thingTagIds, thing.Tags);
            // convert to an output object
        }
    }

    private void AddTags(HashSet<int> tagIds, List<string>? tagStrings)
    {
        if (tagStrings == null)
        {
            return;
        }

        foreach (string tagString in tagStrings)
        {
            if (!_tagMap.ContainsKey(tagString))
            {
                _tagMap[tagString] = _tagIndex++;
            }

            tagIds.Add(_tagMap[tagString]);
        }
    }
}
