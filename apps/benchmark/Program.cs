// See https://aka.ms/new-console-template for more information

using System.Diagnostics;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using Wowthing.Lib.Utilities;

namespace Wowthing.Benchmark;

[MemoryDiagnoser]
public class JsonConverterBench
{
    private readonly string _luaData;

    public JsonConverterBench()
    {
        _luaData = File.ReadAllText("/home/freddie/projects/wowthing-again/temp/WoWthing_Collector.lua");
    }

    [Benchmark]
    public string V1() => LuaToJsonConverter.Convert(_luaData);

    [Benchmark]
    public string V2() => LuaToJsonConverter2.Convert(_luaData);

    [Benchmark]
    public string V3() => LuaToJsonConverter3.Convert(_luaData);

    [Benchmark]
    public string V4() => LuaToJsonConverter4.Convert(_luaData);
}

public class Program
{
    public static void Main(string[] args)
    {
        BenchmarkSwitcher
            .FromAssembly(typeof(Program).Assembly)
            .Run(args);
    }
}
