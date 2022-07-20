using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace Wowthing.Backend.Extensions;

public static class HostExtensions
{
    public static IHost ValidateOptions<T>(this IHost host)
    {
        object options = host.Services.GetService(typeof(IOptions<>).MakeGenericType(typeof(T)));
        if (options != null)
        {
            // Retrieve the value to trigger validation
            var _ = ((IOptions<object>)options).Value;
        }
        return host;
    }
}