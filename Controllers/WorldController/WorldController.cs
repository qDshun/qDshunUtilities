using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.WorldController.Inbound;
using qDshunUtilities.Controllers.WorldController.Outbound;
using qDshunUtilities.Models.World;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.WorldController;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WorldController(ILogger<WorldController> logger, IWorldService worldService) : AuthorizedController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorldDto>>> GetWorlds()
    {
        var models = await worldService.GetWorldsAsync(AuthenticatedUser);

        return Ok(models.Select(worldModel => new WorldDto(worldModel)));
    }

    [HttpGet("{worldId}")]
    public async Task<ActionResult<WorldDto>> GetWorld([FromRoute] Guid worldId)
    {
        return new WorldDto(await worldService.GetWorldAsync(worldId, AuthenticatedUser));
    }

    [HttpPost]
    public async Task<ActionResult> CreateWorld([FromBody] WorldCreateRequest worldCreate)
    {
        await worldService.CreateWorldAsync(worldCreate, AuthenticatedUser);
        return NoContent();
    }

    [HttpPost("{worldId}/invite")]
    public async Task<ActionResult> InviteUserToWorldAsync(
        [FromRoute] Guid worldId,
        [FromBody] InviteUserToWorldRequest request)
    {
        await worldService.InviteUserToWorldAsync(worldId, request, AuthenticatedUser);
        return NoContent();
    }

    [HttpPut("{worldId}")]
    public async Task<ActionResult> UpdateWorld(
        [FromRoute] Guid worldId,
        [FromBody] WorldUpdateRequest worldUpdate)
    {
        await worldService.UpdateWorldAsync(worldId, worldUpdate, AuthenticatedUser);
        return NoContent();
    }

    [HttpDelete("{worldId}")]
    public async Task<ActionResult> DeleteWorld(
        [FromRoute] Guid worldId)
    {
        await worldService.DeleteWorldAsync(worldId, AuthenticatedUser);
        return NoContent();
    }
}
