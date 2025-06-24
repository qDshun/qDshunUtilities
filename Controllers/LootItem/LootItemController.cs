using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.LootItem.Inbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.LootItem;

[Authorize]
[ApiController]
[Route("api/[controller]/")]
public class LootItemController(ILogger<LootItemController> logger, ILootItemService lootItemService) : AuthorizedController
{
    [HttpPost("{lootSourceId}")]
    public async Task<ActionResult> CreateLootItem(
        [FromRoute] Guid lootSourceId,
        [FromBody] LootItemCreateRequest lootSourceCreate)
    {
        await lootItemService.CreateLootItemAsync(lootSourceId, lootSourceCreate, AuthenticatedUser);
        return NoContent();
    }

    [HttpPut("{lootItemId}")]
    public async Task<ActionResult> UpdateLootItem(
        [FromRoute] Guid lootItemId,
        [FromBody] LootItemUpdateRequest lootSourceUpdate)
    {
        await lootItemService.UpdateLootItemAsync(lootItemId, lootSourceUpdate, AuthenticatedUser);
        return NoContent();
    }

    [HttpDelete("{lootItemId}")]
    public async Task<ActionResult> DeleteLootItem(
        [FromRoute] Guid lootItemId)
    {
        await lootItemService.DeleteLootItemAsync(lootItemId, AuthenticatedUser);
        return NoContent();
    }
}
