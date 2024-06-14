using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;

namespace qDshunUtilities.Services;

public interface IAccessService
{
    Task<bool> HasAccessToWorldAsync(Guid worldId, Guid authenticatedUser);
    Task AssertHasAccessToWorldAsync(Guid worldId, Guid authenticatedUser);
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
            throw new UnauthorizedAccessException($"User {authenticatedUser} does not have access to world {worldId}");
        }
    }
}
