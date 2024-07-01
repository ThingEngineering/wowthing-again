namespace Wowthing.Backend.Models.API;

public class ApiTypeName
{
    public string Type { get; set; }
    public string Name { get; set; }

    public TEnum EnumParse<TEnum>()
        where TEnum : struct, Enum
    {
        return Enum.Parse<TEnum>(Type.Replace("_", ""), true);
    }
}
