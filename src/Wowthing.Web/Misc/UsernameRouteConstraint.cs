using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Wowthing.Web.Misc
{
    public class UsernameRouteConstraint : IRouteConstraint
    {
        public static readonly Regex Regex = new Regex(
            @"^[A-Za-z0-9_-]{3,32}$",
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

                return Regex.IsMatch(parameterValueString);
            }

            return false;
        }
    }
}
