namespace Wowthing.Backend.Models.API.Data;

public class ApiDataConnectedRealm
{
    public int Id { get; set; }
    public List<ApiDataConnectedRealmRealm> Realms { get; set; }
}

public class ApiDataConnectedRealmRealm
{
    public int Id {get; set; }
    public string Locale { get; set; }
}
