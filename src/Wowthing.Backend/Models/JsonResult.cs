using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Wowthing.Backend.Models
{
    public class JsonResult<T>
    {
        public T Data { get; set; }
        public bool NotModified { get; set; }
    }
}
