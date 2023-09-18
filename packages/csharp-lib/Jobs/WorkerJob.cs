using System.Text.Json.Serialization;

namespace Wowthing.Lib.Jobs;

public class WorkerJob
{
    public JobPriority Priority { get; set; }
    public JobType Type { get; set; }
    public string[] Data { get; set; }

    [JsonIgnore]
    public string Key
    {
        get
        {
            if (_key == null)
            {
                _key = $"{Priority}||{Type}||{string.Join("||", Data)}";
            }
            return _key;
        }
    }

    private string _key;
}
