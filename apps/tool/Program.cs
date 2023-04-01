using CommandLine;
using Wowthing.Tool.Tools;


return await Parser.Default.ParseArguments<
    AllOptions,
    AppearancesOptions,
    CacheOptions,
    DumpsOptions
>(args)
    .MapResult(
        (AllOptions opts) => RunAll(),
        (AppearancesOptions opts) => RunAppearancesTool(),
        (CacheOptions opts) => RunCacheTool(),
        (DumpsOptions opts) => RunDumpsTool(),
        errs => Task.FromResult(1));

async Task<int> RunAll()
{
    await RunDumpsTool();
    await RunCacheTool();
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

async Task<int> RunCacheTool()
{
    var tool = new CacheTool();
    await tool.Run();
    return 0;
}

[Verb("all", HelpText = "Run all tools")]
class AllOptions
{

}

[Verb("appearances", HelpText = "Generate appearance data")]
class AppearancesOptions
{

}

[Verb("cache", HelpText = "Generate cache data")]
class CacheOptions
{

}

[Verb("dumps", HelpText = "Import data dumps")]
class DumpsOptions
{

}
