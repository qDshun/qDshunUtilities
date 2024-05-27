using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models;
using qDshunUtilities.Services;
using System.Security.Claims;

namespace qDshunUtilities.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WorldController(ILogger<WorldController> logger, IWorldService worldService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<World>>> GetWorlds()
    {
        return Ok(await worldService.GetWorldsAsync(GetAuthenticatedUser()));
    }

    [HttpGet("{worldId}")]
    public async Task<ActionResult<World>> GetWorld([FromRoute] Guid worldId)
    {
        return Ok(await worldService.GetWorldAsync(worldId, GetAuthenticatedUser()));
    }

    [HttpPost]
    public async Task<ActionResult> CreateWorld([FromBody] WorldCreate worldCreate)
    {
        await worldService.CreateWorld(worldCreate, GetAuthenticatedUser());
        return Ok();
    }

    [HttpPut("{worldId}")]
    public async Task<ActionResult> UpdateWorld(
        [FromRoute] Guid worldId,
        [FromBody] WorldUpdate worldUpdate)
    {
        await worldService.UpdateWorld(worldId, worldUpdate, GetAuthenticatedUser());
        return Ok();
    }

    private Guid GetAuthenticatedUser()
    {
        var userIdClaimValue = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        Guid.TryParse(userIdClaimValue, out var userId);
        return userId;
    }
}
