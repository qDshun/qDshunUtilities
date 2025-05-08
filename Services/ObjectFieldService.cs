using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using System.Collections.Generic;

namespace qDshunUtilities.Services;

public interface IObjectFieldService
{
    Task<IEnumerable<ObjectFieldDto>> GetObjectFieldsAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser);
    Task<ObjectFieldDto> GetObjectFieldAsync(Guid worldId, Guid worldObjectId, Guid objectFieldId, Guid authenticatedUser);
    Task CreateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldCreate objectFieldCreate, Guid authenticatedUser);
    Task UpdateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldUpdate objectFieldUpdate, Guid authenticatedUser);
    Task DeleteObjectFieldAsync(Guid worldId, Guid worldObjectId, Guid objectFieldId, Guid authenticatedUser);

}

public class ObjectFieldService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : IObjectFieldService
{

    public async Task<IEnumerable<ObjectFieldDto>> GetObjectFieldsAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);

        List<ObjectFieldDto> objectFields = await dbContext.ObjectFields
            .Where(of => of.TemplatedWorldObjectId == worldObjectId)
            .Select(of => new ObjectFieldDto(of))
            .ToListAsync();
        return objectFields;
    }

    public async Task<ObjectFieldDto> GetObjectFieldAsync(Guid worldId, Guid worldObjectId, Guid objectFieldId, Guid authenticatedUser)
    {
        // Todo: Possible bypass of the access by using unrelated to object fields  worldObjectId and WorldId
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);
        ObjectFieldEntity objectField = await dbContext.ObjectFields
            .Where(of => of.Id == objectFieldId)
            .Where(of => of.TemplatedWorldObjectId == worldObjectId)
            .FirstAsync();

        return new ObjectFieldDto(objectField);
    }

    public async Task CreateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldCreate objectFieldCreate, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);

        var objectFieldEntity = objectFieldCreate.ToEntity();

        dbContext.ObjectFields.Add(objectFieldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateObjectFieldAsync(Guid worldId, Guid worldObjectId, ObjectFieldUpdate objectFieldUpdate, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowEdit);

        var objectFieldEntity = await dbContext.ObjectFields.SingleAsync(of => of.Id == objectFieldUpdate.Id);
        objectFieldEntity.ParentId = objectFieldUpdate.ParentId;
        objectFieldEntity.Name = objectFieldUpdate.Name;
        objectFieldEntity.Value = objectFieldUpdate.Value;
        
        dbContext.ObjectFields.Update(objectFieldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteObjectFieldAsync(Guid worldId, Guid worldObjectId, Guid objectFieldId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowEdit);

        await dbContext.ObjectFields.Where(of => of.Id == objectFieldId).ExecuteDeleteAsync();
    }
}
