using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.Chat.Outbound;
using qDshunUtilities.Models.Chat;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.Chat;

[Authorize]
[ApiController]
[Route("api/{worldId}/[controller]")]
public class ChatController(ILogger<ChatController> logger, IChatService chatService) : AuthorizedController
{
    [HttpGet]
    public async Task<ActionResult<ChatMessagesResponse>> GetLastChatMessages([FromRoute] Guid worldId, [FromQuery] int messageCount)
    {
        return new ChatMessagesResponse(await chatService.GetLastChatMessagesAsync(messageCount, worldId, AuthenticatedUser));
    }
}
