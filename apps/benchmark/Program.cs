// See https://aka.ms/new-console-template for more information

using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using Wowthing.Lib.Utilities;
using Wowthing.Lib.Utilities.LuaParser;

[MemoryDiagnoser]
public class JsonConverterBench
{
    private readonly string _data;

    public JsonConverterBench()
    {
        _data = File.ReadAllText("/home/freddie/projects/wowthing-again/temp/WoWthing_Collector.lua");
    }

    [Benchmark]
    public string Original() => LuaToJsonConverter.Convert(_data);

    [Benchmark]
    public string StringBuilder() => LuaToJsonConverter2.Convert(_data);
}

public class Program
{
    public static void Main(string[] args)
    {
        var summary = BenchmarkSwitcher
            .FromAssembly(typeof(Program).Assembly)
            .Run(args);
    }
}
