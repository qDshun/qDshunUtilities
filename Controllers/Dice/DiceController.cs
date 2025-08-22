using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.Dice.Outbound;
using qDshunUtilities.Models.Loot;
using qDshunUtilities.Models.World;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.Dice;

[ApiController]
[Route("api/[controller]")]
public class DiceController(ILogger<DiceController> logger, IDiceService diceService, ILootSourceService lootSourceService) : AuthorizedController
{
    [AllowAnonymous]
    [HttpGet("{expression}")]
    public async Task<ActionResult<int>> EvaluateDice(string expression)
    {
        return diceService.EvaluateDiceExpression(expression);
    }

    [Authorize]
    [HttpGet("{lootSourceId}/{lootExpression}")]
    public async Task<ActionResult<MaterializeLootSourceResponse>> MaterializeLootSource(Guid lootSourceId, string lootExpression)
    {
        return new MaterializeLootSourceResponse(await lootSourceService.MaterializeLootSourceAsync(lootSourceId, AuthenticatedUser, lootExpression));
    }
}
