using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using System.Collections.Generic;
using System.Security;

namespace qDshunUtilities.Services;

public interface IWorldObjectService
{
    Task<IEnumerable<WorldObject>> GetWorldObjectsAsync(Guid worldId, Guid authenticatedUser);
    Task<WorldObject> GetWorldObjectAsync(Guid worldObjectId, Guid authenticatedUser);
    Task CreateWorldObjectAsync(WorldObjectCreate worldObjectCreate, Guid worldId, Guid authenticatedUser);
    Task UpdateWorldObjectAsync(Guid worldObjectId, WorldUpdate worldObjectUpdate, Guid authenticatedUser);
    Task DeleteWorldObjectAsync(Guid worldObjectId, Guid authenticatedUser);
}

public class WorldObjectService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : IWorldObjectService
{

    public async Task<IEnumerable<WorldObject>> GetWorldObjectsAsync(Guid worldId, Guid authenticatedUser)
    {
        List<WorldObjectEntity> worldObjects = await dbContext.WorldObjects
            .Where(wo => wo.WorldObjectPermissions.Any(wop => wop.WorldUser.UserId == authenticatedUser))
            .Where(wo => wo.WorldId == worldId)
            .Include(wo => wo.WorldObjectPermissions)
                .ThenInclude(w => w.WorldUser)
            .ToListAsync();
        return worldObjects.Select(mapper.Map<WorldObject>);
    }

    public async Task<WorldObject> GetWorldObjectAsync(Guid worldObjectId, Guid authenticatedUser)
    {
        var worldObject = await dbContext.WorldObjects
         .Where(wo => wo.WorldObjectPermissions.Any(wop => wop.WorldUser.UserId == authenticatedUser))
         .Where(wo => wo.Id == worldObjectId)
         .Include(wo => wo.WorldObjectPermissions)
             .ThenInclude(w => w.WorldUser)
         .FirstAsync();

        return mapper.Map<WorldObject>(worldObject);
    }

    public async Task CreateWorldObjectAsync(WorldObjectCreate worldObjectCreate, Guid worldId, Guid authenticatedUser)
    {
        var worldObjectEntity = mapper.Map<WorldObjectEntity>(worldObjectCreate);
        var worldUser = await dbContext.WorldUsers.SingleAsync(wu => wu.UserId == authenticatedUser && wu.WorldId == worldId);
        worldObjectEntity.WorldId = worldId;

        var worldObjectPermissionEntities = await GetWorldObjectPermissionEntitiesAsync([Permissions.AllowEdit, Permissions.AllowRead], worldId, worldUser.Id);

        worldObjectEntity.WorldObjectPermissions.AddRange(worldObjectPermissionEntities);

        dbContext.WorldObjects.Add(worldObjectEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateWorldObjectAsync(Guid worldId, WorldUpdate worldupdate, Guid authenticatedUser)
    {
    }

    public async Task DeleteWorldObjectAsync(Guid worldId, Guid authenticatedUser)
    {

    }

    public async Task<IEnumerable<WorldObjectPermissionEntity>> GetWorldObjectPermissionEntitiesAsync(List<string> permissions, Guid worldId, Guid worldUserId)
    {
        List<WorldObjectPermissionEntity> entities = new List<WorldObjectPermissionEntity>();
        foreach (var permission in permissions)
        {
            var PermissionEntity = await dbContext.Permissions.SingleAsync(p => p.Name == permission);

            WorldObjectPermissionEntity worldObjectPermissionEntity = new WorldObjectPermissionEntity
            {
                WorldObjectId = worldId,
                WorldUserId = worldUserId,
                Permission = PermissionEntity
            };

            entities.Add(worldObjectPermissionEntity);
        }

        return entities;
    }
}
