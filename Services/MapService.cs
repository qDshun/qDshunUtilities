using Microsoft.EntityFrameworkCore;
using qDshunUtilities.Controllers.Map.Inbound;
using qDshunUtilities.Controllers.WorldObject.Inbound;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities.Map;
using qDshunUtilities.EF.Entities.WorldObjects;
using qDshunUtilities.Helpers;
using qDshunUtilities.Hubs.Outbound.Notifications;
using qDshunUtilities.Models.Map;
using qDshunUtilities.Models.WorldObject;
using static qDshunUtilities.Controllers.Map.Outbound.GetMapsResponse;

namespace qDshunUtilities.Services;

public interface IMapService
{
    public Task<IEnumerable<MapModel>> GetMapsAsync(Guid worldId, Guid user);
    public Task<MapModel> GetSingleMapAsync(Guid worldId, Guid mapId, Guid user);
    public Task DeleteMapAsync(Guid worldId, Guid mapId, Guid user);
    public Task CreateMapAsync(Guid worldId, MapCreateRequest request, Guid user);
    public Task UpdateMapAsync(Guid worldId, MapUpdateRequest request, Guid user);
}


public class MapService(ApplicationDbContext dbContext, IAccessService accessService) : IMapService
{
    public async Task<IEnumerable<MapModel>> GetMapsAsync(Guid worldId, Guid user)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, user);
        var maps = await dbContext.Maps.Select(m => m).Where(m => m.WorldId == worldId).ToListAsync();
        return maps.Select(map => new MapModel(map));
    }

    public async Task<MapModel> GetSingleMapAsync(Guid worldId, Guid mapId, Guid user)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, user);
        var map = await dbContext.Maps.Select(m => m).SingleAsync(m => m.WorldId == worldId && m.Id == mapId);
        return new MapModel(map);
    }
    public async Task DeleteMapAsync(Guid worldId, Guid mapId, Guid user)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, user);
        await dbContext.Maps
         .Where(wo => wo.Id == mapId)
         .ExecuteDeleteAsync();
    }
    public async Task UpdateMapAsync(Guid worldId, MapUpdateRequest request, Guid user)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, user);
        var map = await dbContext.Maps.SingleAsync(m => m.WorldId == worldId && m.Id == request.MapId);
        map.Name = request.Name;
        map.CellSize = request.CellSize;
        map.StrokeColor = request.StrokeColor;
        map.BackgroundColor = request.BackgroundColor;
        map.Width = request.Width;
        map.Height = request.Height;
        map.GridType = request.GridType;
        dbContext.Maps.Update(map);
        await dbContext.SaveChangesAsync();
    }

    public async Task CreateMapAsync(Guid worldId, MapCreateRequest request, Guid user)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, user);
        MapEntity map = new MapEntity();
        map.Name = request.Name;
        map.CellSize = request.CellSize;
        map.StrokeColor = request.StrokeColor;
        map.BackgroundColor = request.BackgroundColor;
        map.Width = request.Width;
        map.Height = request.Height;
        map.GridType = request.GridType;
        map.WorldId = worldId;
        dbContext.Maps.Add(map);
        await dbContext.SaveChangesAsync();
    }
}
