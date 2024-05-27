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
}
