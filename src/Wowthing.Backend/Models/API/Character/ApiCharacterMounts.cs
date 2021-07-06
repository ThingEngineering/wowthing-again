using System.Collections.Generic;

namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacterMounts
    {
        public List<ApiCharacterMount> Mounts { get; set; }
    }

    public class ApiCharacterMount
    {
        public ApiObnoxiousObject Mount { get; set; }
    }
}
