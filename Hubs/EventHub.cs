using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using qDshunUtilities.Hubs.Outbound;
using qDshunUtilities.Hubs.Outbound.Notifications;
using qDshunUtilities.Models.Chat;
using qDshunUtilities.Services;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace qDshunUtilities.Hubs;

[Authorize]
public class EventHub(IChatService chatService, IAccessService accessService) : AuthorizedHub
{
    public async Task JoinWorld(Guid worldId)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, AuthenticatedUser);
        UserClaimsDict.TryAdd(AuthenticatedUser.ToString(), Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
        await Groups.AddToGroupAsync(Context.ConnectionId, worldId.ToString());
    }

    public async Task SendNewMessage(string message, Guid worldId)
    {
        var entity = await chatService.CreateChatMessageAsync(message, worldId, AuthenticatedUser);
        await Clients.Group(worldId.ToString()).SendAsync(BaseNotification.NewChatMessage, new ChatMessageModel(entity));
    }
    // Handle removal of entries also, otherwise the element number will bloat 

    public ConcurrentDictionary<string, string> UserClaimsDict;

}

