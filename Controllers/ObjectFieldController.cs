using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers
{
    [ApiController]
    [Route("api/[controller]/{worldId}/{worldObjectId}")]
    public class ObjectFieldController(ILogger<ObjectFieldController> logger, IObjectFieldService objectFieldService) : AuthorizedController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ObjectField>>> GetObjectFields([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId)
        {
            return Ok(await objectFieldService.GetObjectFieldsAsync(worldId, worldObjectId, AuthenticatedUser));
        }

        [HttpGet("{objectFieldId}")]
        public async Task<ActionResult<ObjectField>> GetObjectField([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId, [FromRoute] Guid objectFieldId)
        {
            return Ok(await objectFieldService.GetObjectFieldAsync(worldId, worldObjectId, objectFieldId, AuthenticatedUser));
        }

        [HttpPost]
        public async Task<ActionResult> CreateWorldObject([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId, [FromBody] ObjectFieldCreate objectFieldCreate)
        {
            await objectFieldService.CreateObjectFieldAsync(worldId, worldObjectId, objectFieldCreate, AuthenticatedUser);
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateWorldObject([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId,
            [FromBody] ObjectFieldUpdate objectFieldUpdate)
        {
            await objectFieldService.UpdateObjectFieldAsync(worldId, worldObjectId, objectFieldUpdate, AuthenticatedUser);
            return Ok();
        }


        [HttpDelete]
        public async Task<ActionResult> DeleteWorldObject([FromRoute] Guid worldId,
            [FromRoute] Guid worldObjectId)
        {
            //await objectFieldService.DeleteWorldObjectAsync(worldId, worldObjectId, AuthenticatedUser);
            return Ok();
        }
    }
}
