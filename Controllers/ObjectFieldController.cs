using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers
{
    [ApiController]
    [Route("api/[controller]/{worldId}/{worldObjectId}")]
    public class ObjectFieldController(ILogger<ObjectFieldController> logger, IObjectFieldService objectFieldService) : AuthorizedController
    {
        [HttpGet]
        public async Task<ActionResult<GetObjectFieldsResponse>> GetObjectFields([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId)
        {
            return Ok(await objectFieldService.GetObjectFieldsAsync(worldId, worldObjectId, AuthenticatedUser));
        }

        [HttpGet("{objectFieldId}")]
        public async Task<GetSingleObjectFieldResponse> GetObjectField([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId, [FromRoute] Guid objectFieldId)
        {
            return new GetSingleObjectFieldResponse {Field = await objectFieldService.GetObjectFieldAsync(worldId, worldObjectId, objectFieldId, AuthenticatedUser)};
        }

        [HttpPost]
        public async Task<ActionResult> CreateObjectField([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId, [FromBody] ObjectFieldCreateRequest objectFieldCreate)
        {
            await objectFieldService.CreateObjectFieldAsync(worldId, worldObjectId, objectFieldCreate, AuthenticatedUser);
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> UpdateObjectField([FromRoute] Guid worldId, [FromRoute] Guid worldObjectId,
            [FromBody] ObjectFieldUpdateRequest request)
        {
            await objectFieldService.UpdateObjectFieldAsync(worldId, worldObjectId, request, AuthenticatedUser);
            return Ok();
        }


        [HttpDelete("{objectFieldId}")]
        public async Task<ActionResult> DeleteObjectField([FromRoute] Guid worldId,
            [FromRoute] Guid worldObjectId, [FromRoute] Guid objectFieldId)
        {
            await objectFieldService.DeleteObjectFieldAsync(worldId, worldObjectId, objectFieldId, AuthenticatedUser);
            return Ok();
        }
    }
}
