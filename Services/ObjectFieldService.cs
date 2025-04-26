using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.Services;

public interface IObjectFieldService
{
    Task<IEnumerable<ObjectField>> GetObjectFieldsAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser);
    Task<ObjectField> GetObjectFieldAsync(Guid worldId, Guid worldObjectId, Guid objectFieldId, Guid authenticatedUser);
    Task CreateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldCreate objectFieldCreate, Guid authenticatedUser);
    Task UpdateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldUpdate objectFieldUpdate, Guid authenticatedUser);

    Task UpdateObjectFieldsAsync(Guid worldId, Guid worldObjectId, List<ObjectFieldUpdate> ObjectFieldUpdates, Guid authenticatedUser);
}

public class ObjectFieldService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : IObjectFieldService
{

    public async Task<IEnumerable<ObjectField>> GetObjectFieldsAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);

        List<ObjectFieldEntity> objectFields = await dbContext.ObjectFields
            .Where(of => of.TemplatedWorldObjectId == worldObjectId)
            .ToListAsync();
        return objectFields.Select(mapper.Map<ObjectField>);
    }

    public async Task<ObjectField> GetObjectFieldAsync(Guid worldId, Guid worldObjectId, Guid objectFieldId, Guid authenticatedUser)
    {
        // Todo: Possible bypass of the access by using unrelated to object fields  worldObjectId and WorldId
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);
        ObjectFieldEntity objectField = await dbContext.ObjectFields
            .Where(of => of.Id == objectFieldId)
            .Where(of => of.TemplatedWorldObjectId == worldObjectId)
            .FirstAsync();

        return mapper.Map<ObjectField>(objectField);
    }

    public async Task CreateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldCreate objectFieldCreate, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);

        var objectFieldEntity = mapper.Map<ObjectFieldEntity>(objectFieldCreate);

        objectFieldEntity.TemplatedWorldObjectId = worldObjectId;

        dbContext.ObjectFields.Add(objectFieldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldUpdate objectFieldUpdate, Guid authenticatedUser)
    {
        //var worldObjectEntity = mapper.Map<WorldObjectEntity>(worldObjectUpdate);

        var objectFieldEntity = await dbContext.ObjectFields.SingleAsync(of => of.Id == objectFieldUpdate.Id);
        mapper.Map(objectFieldUpdate, objectFieldEntity);

        dbContext.ObjectFields.Update(objectFieldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateObjectFieldsAsync(Guid worldId, Guid worldObjectId, List<ObjectFieldUpdate> ObjectFieldUpdates, Guid authenticatedUser)
    {
        var objectFieldEntities = mapper.Map<List<ObjectFieldUpdate>, List<ObjectFieldEntity>>(ObjectFieldUpdates);

        dbContext.ObjectFields.UpdateRange(objectFieldEntities);
        await dbContext.SaveChangesAsync();
    }

}
