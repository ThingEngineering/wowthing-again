using Microsoft.AspNetCore.Diagnostics;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class ErrorController : Controller
    {
        private static readonly HashSet<int> SpecificViews = new HashSet<int>
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
                viewModel.OriginalUrl = feature.OriginalPathBase + feature.OriginalPath + feature.OriginalQueryString;
            }

            if (statusCode.HasValue && SpecificViews.Contains(statusCode.Value))
            {
                return View(statusCode.Value.ToString(), viewModel);
            }
            return View(viewModel);
        }
    }
}
