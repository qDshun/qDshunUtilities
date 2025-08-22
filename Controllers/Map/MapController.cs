using Microsoft.AspNetCore.Mvc;
using qDshunUtilities.Controllers.Map.Inbound;
using qDshunUtilities.Controllers.Map.Outbound;
using qDshunUtilities.Controllers.ObjectField.Outbound;
using qDshunUtilities.Services;

namespace qDshunUtilities.Controllers.Map;

[ApiController]
[Route("api/[controller]/{worldId}")]
public class MapController(IMapService mapService) : AuthorizedController
{
    [HttpGet]
    public async Task<ActionResult<GetMapsResponse>> GetMaps([FromRoute] Guid worldId)
    {
        return new GetMapsResponse(await mapService.GetMapsAsync(worldId, AuthenticatedUser));
    }

    [HttpGet("{mapId}")]
    public async Task<ActionResult<GetSingleMapResponse>> GetSingleMap([FromRoute] Guid worldId, [FromRoute] Guid mapId)
    {
        return new GetSingleMapResponse(await mapService.GetSingleMapAsync(worldId, mapId, AuthenticatedUser));
    }

    [HttpPost]
    public async Task<ActionResult> CreateMap([FromRoute] Guid worldId, [FromBody] MapCreateRequest request)
    {
        await mapService.CreateMapAsync(worldId, request, AuthenticatedUser);
        return Ok();
    }

    [HttpPut]
    public async Task<ActionResult> UpdateMap([FromRoute] Guid worldId, [FromBody] MapUpdateRequest request)
    {
        await mapService.UpdateMapAsync(worldId, request, AuthenticatedUser);
        return Ok();
    }
    [HttpDelete]
    public async Task<ActionResult> DeleteMap([FromRoute] Guid worldId, [FromBody] Guid mapId)
    {
        await mapService.DeleteMapAsync(worldId, mapId, AuthenticatedUser);
        return Ok();
    }

}
