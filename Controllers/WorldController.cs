using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WorldController(ILogger<WorldController> logger, IWorldService worldService) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<World>>> GetWorlds()
    {
        var hardcodedUserId = Guid.NewGuid();
        return Ok(await worldService.GetWorldsAsync(hardcodedUserId));
    }

    [HttpGet("{worldId}")]
    public async Task<ActionResult<World>> GetWorld([FromRoute] Guid worldId)
    {
        var hardcodedUserId = Guid.NewGuid();
        return Ok(await worldService.GetWorldAsync(worldId, hardcodedUserId));
    }

    [HttpPost]
    public async Task<ActionResult> CreateWorld([FromBody] WorldCreate worldCreate)
    {
        var hardcodedUserId = Guid.NewGuid();
        await worldService.CreateWorld(worldCreate, hardcodedUserId);
        return Ok();
    }

    [HttpPut("{worldId}")]
    public async Task<ActionResult> UpdateWorld(
        [FromRoute] Guid worldId,
        [FromBody] WorldUpdate worldUpdate)
    {
        var hardcodedUserId = Guid.NewGuid();
        await worldService.UpdateWorld(worldId, worldUpdate, hardcodedUserId);
        return Ok();
    }
}
