using System.Net.Http;

namespace Wowthing.Backend.Extensions;

public static class DispatcherExtensions
{
    private sealed class DispatcherDelegatingHandler : DelegatingHandler
    {
        private readonly ComposableAsync.IDispatcher _dispatcher;

        public DispatcherDelegatingHandler(ComposableAsync.IDispatcher dispatcher)
        {
            _dispatcher = dispatcher;
        }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            return _dispatcher.Enqueue(() =>
                base.SendAsync(request, cancellationToken), cancellationToken);
        }
    }

    public static DelegatingHandler AsFixedDelegatingHandler(this ComposableAsync.IDispatcher dispatcher)
    {
        return new DispatcherDelegatingHandler(dispatcher);
    }
}
