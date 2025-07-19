namespace Wowthing.Tool.Models.Instances;

public class DataInstance
{
    public int InstanceId { get; set; }
    public string Difficulties { get; set; }

    public Dictionary<string, DataInstanceEncounter> Encounters {get; set; }
}
