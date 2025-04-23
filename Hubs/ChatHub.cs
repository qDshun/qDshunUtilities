using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Hubs;

[Authorize]
public class ChatHub(IChatService chatService) : AuthorizedHub
{
    public async Task NewMessage(string message, Guid worldId)
    {
        var entity = await chatService.CreateChatMessageAsync(message, worldId, AuthenticatedUser);
        await Clients.All.SendAsync("messageReceived", new ChatMessage(entity));
    }
}