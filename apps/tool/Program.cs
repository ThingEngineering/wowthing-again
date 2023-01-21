using CommandLine;
using Wowthing.Tool.Tools;


return CommandLine.Parser.Default.ParseArguments<AllOptions, CacheOptions, DumpsOptions>(args)
    .MapResult(
        (AllOptions opts) => RunAll(),
        (CacheOptions opts) => CacheTool.Run(),
        (DumpsOptions opts) => DumpsTool.Run(),
        errs => 1);

int RunAll()
{
    DumpsTool.Run();
    CacheTool.Run();

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
