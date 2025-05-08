using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers
{
    [ApiController]
    [Route("api/[controller]/{worldId}")]
    public class WorldObjectController(ILogger<WorldObjectController> logger, IWorldObjectService worldObjectService) : AuthorizedController
    {
        [HttpGet]
        public async Task<ActionResult<GetWorldObjectResponse>> GetWorldObjects([FromRoute] Guid worldId)
        {
            return Ok(await worldObjectService.GetWorldObjectsAsync(worldId, AuthenticatedUser));
        }

        [HttpGet("{worldObjectId}")]
        public async Task<ActionResult<WorldObjectResponse>> GetWorldObject([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId)
        {
            return Ok(await worldObjectService.GetWorldObjectAsync(worldId, worldObjectId, AuthenticatedUser));
        }

        [HttpPost]
        public async Task<ActionResult> CreateWorldObject([FromRoute] Guid worldId, [FromBody] WorldObjectCreateRequest worldObjectCreate)
        {
            await worldObjectService.CreateWorldObjectAsync(worldId, worldObjectCreate, AuthenticatedUser);
            return Ok();
        }

        [HttpPut("charactet-sheet")]
        public async Task<ActionResult> UpdateCharacterSheet([FromRoute] Guid worldId,
        [FromBody] CharacterSheetUpdateRequest request)
        {
            await worldObjectService.UpdateCharacterSheetAsync(worldId, request, AuthenticatedUser);
            return Ok();
        }


        [HttpDelete("{worldObjectId}")]
        public async Task<ActionResult> DeleteWorldObject([FromRoute] Guid worldId,
            [FromRoute] Guid worldObjectId)
        {
            await worldObjectService.DeleteWorldObjectAsync(worldId, worldObjectId, AuthenticatedUser);
            return Ok();
        }
    }
}
