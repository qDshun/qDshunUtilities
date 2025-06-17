using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.WorldController.Inbound;
using qDshunUtilities.Models.World;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.WorldController;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WorldController(ILogger<WorldController> logger, IWorldService worldService) : AuthorizedController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorldModel>>> GetWorlds()
    {
        return Ok(await worldService.GetWorldsAsync(AuthenticatedUser));
    }

    [HttpGet("{worldId}")]
    public async Task<ActionResult<WorldModel>> GetWorld([FromRoute] Guid worldId)
    {
        return Ok(await worldService.GetWorldAsync(worldId, AuthenticatedUser));
    }

    [HttpPost]
    public async Task<ActionResult> CreateWorld([FromBody] WorldCreateRequest worldCreate)
    {
        await worldService.CreateWorldAsync(worldCreate, AuthenticatedUser);
        return Ok();
    }

    [HttpPost("{worldId}/invite")]
    public async Task<ActionResult> InviteUserToWorldAsync(
        [FromRoute] Guid worldId,
        [FromBody] InviteUserToWorldRequest request)
    {
        await worldService.InviteUserToWorldAsync(worldId, request, AuthenticatedUser);
        return Ok();
    }

    [HttpPut("{worldId}")]
    public async Task<ActionResult> UpdateWorld(
        [FromRoute] Guid worldId,
        [FromBody] WorldUpdateRequest worldUpdate)
    {
        await worldService.UpdateWorldAsync(worldId, worldUpdate, AuthenticatedUser);
        return Ok();
    }

    [HttpDelete("{worldId}")]
    public async Task<ActionResult> DeleteWorld(
        [FromRoute] Guid worldId)
    {
        await worldService.DeleteWorldAsync(worldId, AuthenticatedUser);
        return Ok();
    }
}
