using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.LootSource.Inbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.LootSource;

[Authorize]
[ApiController]
[Route("api/[controller]/")]
public class LootSourceController(ILogger<LootSourceController> logger, ILootSourceService lootSourceService) : AuthorizedController
{
    [HttpPost("{worldId}")]
    public async Task<ActionResult> CreateLootSource(
        [FromRoute] Guid worldId,
        [FromBody] LootSourceCreateRequest lootSourceCreate)
    {
        await lootSourceService.CreateLootSourceAsync(worldId, lootSourceCreate, AuthenticatedUser);
        return NoContent();
    }

    [HttpPut("{lootSourceId}")]
    public async Task<ActionResult> UpdateLootSource(
        [FromRoute] Guid lootSourceId,
        [FromBody] LootSourceUpdateRequest lootSourceUpdate)
    {
        await lootSourceService.UpdateLootSourceAsync(lootSourceId, lootSourceUpdate, AuthenticatedUser);
        return NoContent();
    }

    [HttpDelete("{lootSourceId}")]
    public async Task<ActionResult> DeleteLootSource(
        [FromRoute] Guid lootSourceId)
    {
        await lootSourceService.DeleteLootSourceAsync(lootSourceId, AuthenticatedUser);
        return NoContent();
    }
}
