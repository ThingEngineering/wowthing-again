using CommandLine;
using Wowthing.Tool.Tools;


return await CommandLine.Parser.Default.ParseArguments<AllOptions, CacheOptions, DumpsOptions>(args)
    .MapResult(
        (AllOptions opts) => RunAll(),
        (CacheOptions opts) => RunCacheTool(),
        (DumpsOptions opts) => RunDumpsTool(),
        errs => Task.FromResult(1));

async Task<int> RunAll()
{
    await RunDumpsTool();
    await RunCacheTool();

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

[Verb("cache", HelpText = "Generate cache data")]
class CacheOptions
{

}

[Verb("dumps", HelpText = "Import data dumps")]
class DumpsOptions
{

}
