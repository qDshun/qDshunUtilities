using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiceController(ILogger<WorldController> logger, IDiceService diceService, ILootSourceService lootSourceService) : AuthorizedController
{
    [AllowAnonymous]
    [HttpGet("{expression}")]
    public async Task<ActionResult<IEnumerable<World>>> EvaluateDice(string expression)
    {
        return Ok(diceService.EvaluateDiceExpression(expression));
    }

    [Authorize]
    [HttpGet("{lootSourceId}/{lootExpression}")]
    public async Task<ActionResult<MaterializedLootSource>> MaterializeLootSource(Guid lootSourceId, string lootExpression)
    {
        return Ok(await lootSourceService.MaterializeLootSourceAsync(lootSourceId, AuthenticatedUser, lootExpression));
    }
}
