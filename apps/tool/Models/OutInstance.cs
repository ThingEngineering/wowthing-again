namespace Wowthing.Tool.Models;

[JsonConverter(typeof(OutInstanceConverter))]
public class OutInstance
{
    public int Expansion { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }

    public string ShortName
    {
        get
        {
            // lookup thing
            string shortName = Hardcoded.InstanceShortNameOverride
                .GetValueOrDefault(Name) ?? string.Join("", Name.Split().Where(w => w.ToLowerInvariant() != "the").Select(w => w[0]));
            return shortName;
        }
    }

    public OutInstance(DumpMap map, int instanceId)
    {
        Expansion = map.ExpansionID;
        Id = instanceId;
        Name = map.Name;
    }
}
