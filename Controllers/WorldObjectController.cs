using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WorldObjectController(ILogger<WorldController> logger, IWorldObjectService worldObjectService) : AuthorizedController
    {
        [HttpGet("{worldId}")]
        public async Task<ActionResult<IEnumerable<WorldObject>>> GetWorldObjects([FromRoute] Guid worldId)
        {
            return Ok(await worldObjectService.GetWorldObjectsAsync(worldId, AuthenticatedUser));
        }

        [HttpGet]
        public async Task<ActionResult<World>> GetWorld([FromRoute] Guid worldId)
        {
            return Ok(worldObjectService.GetWorldObjectAsync(worldId, AuthenticatedUser));
        }

        [HttpPost("{worldId}")]
        public async Task<ActionResult> CreateWorldObject([FromBody] WorldObjectCreate worldObjectCreate, [FromRoute] Guid worldId)
        {
            await worldObjectService.CreateWorldObjectAsync(worldObjectCreate, worldId, AuthenticatedUser);
            return Ok();
        }

        [HttpPut("{worldId}")]
        public async Task<ActionResult> UpdateWorld(
        [FromRoute] Guid worldId,
            [FromBody] WorldUpdate worldUpdate)
        {
            return Ok();
        }


        [HttpDelete("{worldId}")]
        public async Task<ActionResult> DeleteWorld(
            [FromRoute] Guid worldId)
        {
            return Ok();
        }
    }
}
