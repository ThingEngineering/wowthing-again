using Wowthing.Lib.Utilities;

var data = File.ReadAllText("/home/freddie/projects/wowthing-again/temp/WoWthing_Collector.lua")
    .Replace("WWTCSaved = ", "");
Console.WriteLine("data: {0:n0}", data.Length);

var version1 = LuaToJsonConverter.Convert(data);
Console.WriteLine("  v1: {0:n0}", version1.Length);
File.WriteAllText("/home/freddie/projects/wowthing-again/temp/lua1.json", version1);

var version2 = LuaToJsonConverter2.Convert(data);
Console.WriteLine("  v2: {0:n0}", version2.Length);
File.WriteAllText("/home/freddie/projects/wowthing-again/temp/lua2.json", version2);

var version3 = LuaToJsonConverter3.Convert(data);
Console.WriteLine("  v3: {0:n0}", version3.Length);
File.WriteAllText("/home/freddie/projects/wowthing-again/temp/lua3.json", version3);
