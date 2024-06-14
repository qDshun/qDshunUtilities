using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/")]
public class LootItemController(ILogger<LootItemController> logger, ILootItemService lootItemService) : AuthorizedController
{
    [HttpPost("{lootSourceId}")]
    public async Task<ActionResult> CreateLootItem(
        [FromRoute] Guid lootSourceId,
        [FromBody] LootItemCreate lootSourceCreate)
    {
        await lootItemService.CreateLootItemAsync(lootSourceId, lootSourceCreate, AuthenticatedUser);
        return Ok();
    }

    [HttpPut("{lootItemId}")]
    public async Task<ActionResult> UpdateLootItem(
        [FromRoute] Guid lootItemId,
        [FromBody] LootItemUpdate lootSourceUpdate)
    {
        await lootItemService.UpdateLootItemAsync(lootItemId, lootSourceUpdate, AuthenticatedUser);
        return Ok();
    }

    [HttpDelete("{lootItemId}")]
    public async Task<ActionResult> DeleteLootItem(
        [FromRoute] Guid lootItemId)
    {
        await lootItemService.DeleteLootItemAsync(lootItemId, AuthenticatedUser);
        return Ok();
    }
}
