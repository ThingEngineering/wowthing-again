using CommandLine;
using Wowthing.Tool.Tools;


return await Parser.Default.ParseArguments<
    AllOptions,
    AchievementsOptions,
    AppearancesOptions,
    DumpsOptions,
    ItemsOptions,
    JournalOptions,
    ManualOptions,
    StaticOptions
>(args)
    .MapResult(
        (AllOptions _) => RunAll(),
        (AchievementsOptions _) => RunAchievementsTool(),
        (AppearancesOptions _) => RunAppearancesTool(),
        (DumpsOptions _) => RunDumpsTool(),
        (ItemsOptions _) => RunItemsTool(),
        (JournalOptions _) => RunJournalTool(),
        (ManualOptions _) => RunManualTool(),
        (StaticOptions _) => RunStaticTool(),
        _ => Task.FromResult(1));

async Task<int> RunAll()
{
    await RunDumpsTool();

    await RunAchievementsTool();
    await RunAppearancesTool();
    await RunItemsTool();
    await RunJournalTool();
    await RunManualTool();
    await RunStaticTool();

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

async Task<int> RunJournalTool()
{
    var tool = new JournalTool();
    await tool.Run();
    return 0;
}

async Task<int> RunManualTool()
{
    var tool = new ManualTool();
    await tool.Run();
    return 0;
}

async Task<int> RunStaticTool()
{
    var tool = new StaticTool();
    await tool.Run();
    return 0;
}

[Verb("all", HelpText = "Run all tools")]
class AllOptions { }

[Verb("achievements", HelpText = "Generate achievement data")]
class AchievementsOptions { }

[Verb("appearances", HelpText = "Generate appearance data")]
class AppearancesOptions { }

[Verb("dumps", HelpText = "Import data dumps")]
class DumpsOptions { }

[Verb("items", HelpText = "Generate item data")]
class ItemsOptions { }

[Verb("journal", HelpText = "Generate journal data")]
class JournalOptions { }

[Verb("manual", HelpText = "Generate manual data")]
class ManualOptions { }

[Verb("static", HelpText = "Generate static data")]
class StaticOptions { }
