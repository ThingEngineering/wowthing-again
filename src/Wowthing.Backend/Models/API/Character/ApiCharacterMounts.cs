using System;
using System.Collections.Generic;
using System.Text;

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
