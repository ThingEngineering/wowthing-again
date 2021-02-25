using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Wowthing.Web.Misc
{
    public class SlugRouteConstraint : IRouteConstraint
    {
        private readonly Regex _regex = new Regex(
            @"^[A-Za-z0-9-]+$",
            RegexOptions.Compiled | RegexOptions.CultureInvariant | RegexOptions.IgnoreCase,
            TimeSpan.FromMilliseconds(100)
        );

        public bool Match(HttpContext httpContext, IRouter route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {
            if (values.TryGetValue(routeKey, out object value))
            {
                var parameterValueString = Convert.ToString(value, CultureInfo.InvariantCulture);
                if (parameterValueString == null)
                {
                    return false;
                }

                return _regex.IsMatch(parameterValueString);
            }

            return false;
        }
    }
}
