using Wowthing.Lib.Utilities;
using Wowthing.Lib.Utilities.LuaParser;

var data = File.ReadAllText("/home/freddie/projects/wowthing-again/temp/WoWthing_Collector.lua")
    .Replace("WWTCSaved = ", "");
Console.WriteLine("data    : {0:n0}", data.Length);

var originalVersion = LuaToJsonConverter.Convert(data);
Console.WriteLine("original: {0:n0}", originalVersion.Length);
File.WriteAllText("/home/freddie/projects/wowthing-again/temp/lua1.json", originalVersion);

var newVersion = LuaToJsonConverter2.Convert(data);
Console.WriteLine("new     : {0:n0}", newVersion.Length);
File.WriteAllText("/home/freddie/projects/wowthing-again/temp/lua2.json", newVersion);
