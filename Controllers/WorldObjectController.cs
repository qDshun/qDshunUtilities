using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("{worldId}")]
        public async Task<ActionResult> CreateWorldObject([FromRoute] Guid worldId, [FromBody] WorldObjectCreate worldObjectCreate)
        {
            await worldObjectService.CreateWorldObjectAsync(worldId, AuthenticatedUser, worldObjectCreate);
            return Ok();
        }

        [HttpPut("{worldObjectId}")]
        public async Task<ActionResult> UpdateWorldObject([FromRoute] Guid worldObjectId, [FromBody] WorldObjectUpdate worldObjectUpdate)
        {
            await worldObjectService.UpdateWorldObjectAsync(worldObjectId, AuthenticatedUser, worldObjectUpdate);
            return Ok();
        }


        [HttpDelete("{worldObjectId}")]
        public async Task<ActionResult> DeleteWorld([FromRoute] Guid worldObjectId)
        {
            await worldObjectService.DeleteWorldObjectAsync(worldObjectId, AuthenticatedUser);
            return Ok();
        }
    }
}
