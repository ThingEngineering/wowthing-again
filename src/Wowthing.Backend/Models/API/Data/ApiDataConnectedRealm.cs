using System.Collections.Generic;

namespace Wowthing.Backend.Models.API.Data
{
    public class ApiDataConnectedRealm
    {
        public int Id { get; set; }
        public List<ApiObnoxiousObject> Realms { get; set; }
    }
}
