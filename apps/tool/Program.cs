using CommandLine;
using Wowthing.Tool.Tools;


return await Parser.Default.ParseArguments<
    AllOptions,
    AchievementsOptions,
    AppearancesOptions,
    CacheOptions,
    DumpsOptions,
    ItemsOptions
>(args)
    .MapResult(
        (AllOptions opts) => RunAll(),
        (AchievementsOptions opts) => RunAchievementsTool(),
        (AppearancesOptions opts) => RunAppearancesTool(),
        (CacheOptions opts) => RunCacheTool(),
        (DumpsOptions opts) => RunDumpsTool(),
        (ItemsOptions opts) => RunItemsTool(),
        errs => Task.FromResult(1));

async Task<int> RunAll()
{
    await RunDumpsTool();

    await RunAchievementsTool();
    await RunAppearancesTool();
    await RunItemsTool();

    return 0;
}

async Task<int> RunAchievementsTool()
{
    var tool = new AchievementsTool();
    await tool.Run();
    return 0;
}

async Task<int> RunAppearancesTool()
{
    var tool = new AppearancesTool();
    await tool.Run();
    return 0;
}

async Task<int> RunCacheTool()
{
    var tool = new CacheTool();
    await tool.Run();
    return 0;
}

async Task<int> RunDumpsTool()
{
    var tool = new DumpsTool();
    await tool.Run();
    return 0;
}

async Task<int> RunItemsTool()
{
    var tool = new ItemsTool();
    await tool.Run();
    return 0;
}

[Verb("all", HelpText = "Run all tools")]
class AllOptions { }

[Verb("achievements", HelpText = "Generate achievement data")]
class AchievementsOptions { }

[Verb("appearances", HelpText = "Generate appearance data")]
class AppearancesOptions { }

[Verb("cache", HelpText = "Generate cache data")]
class CacheOptions { }

[Verb("dumps", HelpText = "Import data dumps")]
class DumpsOptions { }

[Verb("items", HelpText = "Generate item data")]
class ItemsOptions { }
