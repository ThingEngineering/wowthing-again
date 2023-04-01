namespace Wowthing.Tool.Models.Progress;

public class OutProgressData
{
    public List<int> Ids { get; set; }

    // [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string? Description { get; set; }

    public string Name { get; set; }

    public ProgressDataType Type { get; set; }

    // [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? Value { get; set; }

    // [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public bool? Required { get; set; }

    public OutProgressData(DataProgressData data)
    {
        Description = data.Description;
        Name = data.Name;

        Ids = data.Id
            .EmptyIfNullOrWhitespace()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(id => int.Parse(id))
            .ToList();

        if (!string.IsNullOrWhiteSpace(data.Type))
        {
            Type = Enum.Parse<ProgressDataType>(data.Type, true);
        }

        if (data.Value > 0)
        {
            Value = data.Value;
        }

        if (data.Required)
        {
            Required = data.Required;
        }
    }
}
