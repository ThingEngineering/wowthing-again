using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

public static class IHostExtensions
{
    public static IHost ValidateOptions<T>(this IHost host)
    {
        object options = host.Services.GetService(typeof(IOptions<>).MakeGenericType(typeof(T)));
        if (options != null)
        {
            // Retrieve the value to trigger validation
            var optionsValue = ((IOptions<object>)options).Value;
        }
        return host;
    }
}
