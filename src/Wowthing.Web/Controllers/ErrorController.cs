using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class ErrorController : Controller
    {
        private static HashSet<int> _specificViews = new HashSet<int>
        {
            (int)HttpStatusCode.Forbidden, // 403
            (int)HttpStatusCode.NotFound, // 404
        };

        [Route("error")]
        public IActionResult Error(int? statusCode = null)
        {
            var viewModel = new ErrorViewModel
            {
                RequestId = HttpContext.TraceIdentifier,
            };

            var feature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            if (feature != null)
            {
                viewModel.OriginalURL = feature.OriginalPathBase + feature.OriginalPath + feature.OriginalQueryString;
            }

            if (statusCode.HasValue && _specificViews.Contains(statusCode.Value))
            {
                return View(statusCode.Value.ToString(), viewModel);
            }
            return View(viewModel);
        }
    }
}
