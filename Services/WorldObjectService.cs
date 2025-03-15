using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Services;

public interface IWorldObjectService
{
    Task<IEnumerable<WorldObject>> GetWorldObjectsAsync(Guid worldId, Guid authenticatedUser);
    Task CreateWorldObjectAsync(Guid worldId, WorldObjectCreate worldObjectCreate, Guid authenticatedUser);
    Task<WorldObject> GetWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser);
    Task UpdateWorldObjectAsync(Guid worldId, WorldObjectUpdate worldObjectUpdate, Guid authenticatedUser);
    Task DeleteWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser);
}

public class WorldObjectService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : IWorldObjectService
{
    public async Task<IEnumerable<WorldObject>> GetWorldObjectsAsync(Guid worldId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        List<WorldObjectEntity> worldObjects = await dbContext.WorldObjects
            .Where(wo => wo.WorldId == worldId)
            .Include(wo => wo.WorldObjectPermissions)
                .ThenInclude(w => w.WorldUser)
            .ToListAsync();
        return worldObjects.Select(mapper.Map<WorldObject>);
    }

    public async Task<WorldObject> GetWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);

        var worldObject = await dbContext.WorldObjects
         .Where(wo => wo.Id == worldObjectId)
         .Include(wo => wo.WorldObjectPermissions)
             .ThenInclude(w => w.WorldUser)
         .FirstAsync();

        return mapper.Map<WorldObject>(worldObject);
    }

    public async Task CreateWorldObjectAsync(Guid worldId, WorldObjectCreate worldObjectCreate, Guid authenticatedUser)
    {
        var worldObjectEntity = mapper.Map<WorldObjectEntity>(worldObjectCreate);
        var worldUser = await dbContext.WorldUsers.SingleAsync(wu => wu.UserId == authenticatedUser && wu.WorldId == worldId);
        worldObjectEntity.WorldId = worldId;

        var worldObjectPermissionEntities = await CreateWorldObjectPermissionEntitiesAsync([Perms.AllowEdit, Perms.AllowRead], worldId, worldUser.Id);

        worldObjectEntity.WorldObjectPermissions.AddRange(worldObjectPermissionEntities);

        dbContext.WorldObjects.Add(worldObjectEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateWorldObjectAsync(Guid worldId, WorldObjectUpdate worldObjectUpdate, Guid authenticatedUser)
    {
        //var worldObjectEntity = mapper.Map<WorldObjectEntity>(worldObjectUpdate);
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectUpdate.Id, authenticatedUser, Perms.AllowRead);

        var worldObjectEntity = await dbContext.WorldObjects.SingleAsync(w => w.Id == worldObjectUpdate.Id);
        mapper.Map(worldObjectUpdate, worldObjectEntity);

        dbContext.WorldObjects.Update(worldObjectEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser)
    {
        // Todo: Set onDelete : Cascade 
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowEdit);

        var worldObjectEntity = await dbContext.WorldObjects.SingleAsync(wo => wo.Id == worldObjectId);

        dbContext.WorldObjects.Remove(worldObjectEntity);
        await dbContext.SaveChangesAsync();
    }

    private async Task<IEnumerable<WorldObjectPermissionEntity>> CreateWorldObjectPermissionEntitiesAsync(List<string> permissions, Guid worldId, Guid worldUserId)
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
