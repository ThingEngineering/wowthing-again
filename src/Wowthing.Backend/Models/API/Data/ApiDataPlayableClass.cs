using System;
using System.Collections.Generic;
using System.Text;

namespace Wowthing.Backend.Models.API.Data
{
    public class ApiDataPlayableClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ApiObnoxiousObject Media { get; set; }
        public List<ApiObnoxiousObject> Specializations { get; set; }
    }
}
