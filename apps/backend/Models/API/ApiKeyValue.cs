namespace Wowthing.Backend.Models.API;

public class ApiKeyValue<TValue>
{
    public string Key { get; set; }
    public TValue Value { get; set; }
}