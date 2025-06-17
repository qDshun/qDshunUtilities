using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public async Task<ActionResult<IEnumerable<WorldModel>>> EvaluateDice(string expression)
    {
        return Ok(diceService.EvaluateDiceExpression(expression));
    }

    [Authorize]
    [HttpGet("{lootSourceId}/{lootExpression}")]
    public async Task<ActionResult<MaterializedLootSourceModel>> MaterializeLootSource(Guid lootSourceId, string lootExpression)
    {
        return Ok(await lootSourceService.MaterializeLootSourceAsync(lootSourceId, AuthenticatedUser, lootExpression));
    }
}
