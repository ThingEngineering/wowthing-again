using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Wowthing.Web.Hubs;

public class UserUpdateHub : Hub
{
    private readonly ILogger<UserUpdateHub> _logger;

    public UserUpdateHub(ILogger<UserUpdateHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        if (Context.UserIdentifier != null)
        {
            _logger.LogDebug("Client connected {user} ({id})", Context.UserIdentifier, Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, Context.UserIdentifier);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _logger.LogDebug("Client disconnected {user} ({id})", Context.UserIdentifier, Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
