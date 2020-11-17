using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Wowthing.Web.ViewModels
{
    public class ErrorViewModel
    {
        public string RequestId;
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public string OriginalURL { get; set; }
    }
}
