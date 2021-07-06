using System.Collections.Generic;

namespace Wowthing.Backend.Models.API.Data
{
    public class ApiDataRealmIndex
    {
        public List<ApiDataRealm> Realms { get; set; }
    }

    public class ApiDataRealm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
    }
}
