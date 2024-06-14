using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/")]
public class LootSourceController(ILogger<LootSourceController> logger, ILootSourceService lootSourceService) : AuthorizedController
{
    [HttpPost("{worldId}")]
    public async Task<ActionResult> CreateLootSource(
        [FromRoute] Guid worldId,
        [FromBody] LootSourceCreate lootSourceCreate)
    {
        await lootSourceService.CreateLootSourceAsync(worldId, lootSourceCreate, AuthenticatedUser);
        return Ok();
    }

    [HttpPut("{lootSourceId}")]
    public async Task<ActionResult> UpdateLootSource(
        [FromRoute] Guid lootSourceId,
        [FromBody] LootSourceUpdate lootSourceUpdate)
    {
        await lootSourceService.UpdateLootSourceAsync(lootSourceId, lootSourceUpdate, AuthenticatedUser);
        return Ok();
    }

    [HttpDelete("{lootSourceId}")]
    public async Task<ActionResult> DeleteLootSource(
        [FromRoute] Guid lootSourceId)
    {
        await lootSourceService.DeleteLootSourceAsync(lootSourceId, AuthenticatedUser);
        return Ok();
    }
}
