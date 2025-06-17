using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.Chat.Inbound;
using qDshunUtilities.Hubs.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.Chat;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController(ILogger<ChatController> logger, IChatService chatService) : AuthorizedController
{
    [HttpPost]
    public async Task<ActionResult<IEnumerable<ChatMessage>>> GetLastChatMessages([FromBody] GetLastMessagesRequest request)
    {
        return Ok(await chatService.GetLastChatMessagesAsync(request.MsgCount, request.WorldId, AuthenticatedUser));
    }
}
