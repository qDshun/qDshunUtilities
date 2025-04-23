using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController(ILogger<ChatController> logger, IChatService chatService) : AuthorizedController
{
    [HttpPost]
    public async Task<ActionResult<IEnumerable<ChatMessage>>> GetLastChatMessages([FromBody] GetLastMessages request)
    {
        return Ok(await chatService.GetLastChatMessagesAsync(request.MsgCount, request.WorldId, AuthenticatedUser));
    }
}
