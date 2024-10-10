using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WorldController(ILogger<WorldController> logger, IWorldService worldService) : AuthorizedController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<World>>> GetWorlds()
    {
        return Ok(await worldService.GetWorldsAsync(AuthenticatedUser));
    }

    [HttpGet("{worldId}")]
    public async Task<ActionResult<World>> GetWorld([FromRoute] Guid worldId)
    {
        return Ok(await worldService.GetWorldAsync(worldId, AuthenticatedUser));
    }

    [HttpPost]
    public async Task<ActionResult> CreateWorld([FromBody] WorldCreate worldCreate)
    {
        await worldService.CreateWorldAsync(worldCreate, AuthenticatedUser);
        return Ok();
    }

    [HttpPut("{worldId}")]
    public async Task<ActionResult> UpdateWorld(
        [FromRoute] Guid worldId,
        [FromBody] WorldUpdate worldUpdate)
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
