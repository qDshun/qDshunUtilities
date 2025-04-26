using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.Exceptions;

namespace qDshunUtilities.Services;

public interface IAccessService
{
    Task<bool> HasAccessToWorldAsync(Guid worldId, Guid authenticatedUser);
    Task AssertHasAccessToWorldAsync(Guid worldId, Guid authenticatedUser);

    Task<bool> HasWorldObjectPermission(Guid worldObjectId, Guid authenticatedUser, string permission);
    Task AssertHasWorldObjectPermissionAsync(Guid worldObjectId, Guid authenticatedUser, string permission);
}

public class AccessService(ApplicationDbContext dbContext, IMapper mapper) : IAccessService
{
    public async Task<bool> HasAccessToWorldAsync(Guid worldId, Guid authenticatedUser)
    {
        return await dbContext.WorldUsers
            .AnyAsync(wu => wu.WorldId == worldId && wu.UserId == authenticatedUser);
    }

    public async Task AssertHasAccessToWorldAsync(Guid worldId, Guid authenticatedUser)
    {
        if (!await HasAccessToWorldAsync(worldId, authenticatedUser))
        {
            throw new UnauthorizedRequestException($"User {authenticatedUser} does not have access to world {worldId}");
        }
    }

    public async Task<bool> HasWorldObjectPermission(Guid worldObjectId, Guid authenticatedUser, string permission)
    {
        var worldObject = await dbContext.WorldObjects.SingleAsync(wo => wo.Id == worldObjectId);
        return await dbContext.WorldObjectPermissions.AnyAsync(wop => 
            wop.WorldObject.WorldId == worldObject.WorldId 
            && wop.WorldUser.UserId == authenticatedUser 
            && (wop.WorldObjectId == worldObjectId || wop.WorldObjectId == null) 
            && wop.Permission.Name == permission
            );
    }

    public async Task AssertHasWorldObjectPermissionAsync(Guid worldObjectId, Guid authenticatedUser, string permission)
    {
        if (!await HasWorldObjectPermission(worldObjectId, authenticatedUser, permission))
        {
            throw new UnauthorizedRequestException($"User {authenticatedUser} does not have access to world object {worldObjectId}");
        }
    }
}
