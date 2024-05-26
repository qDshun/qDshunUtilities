using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.Models;

namespace qDshunUtilities.Services;

public interface IWorldService
{
    Task<IEnumerable<World>> GetWorldsAsync(Guid authenticatedUser);
    Task<World> GetWorldAsync(Guid worldId, Guid authenticatedUser);
}

public class WorldService(ApplicationDbContext dbContext, IMapper mapper) : IWorldService
{
    public async Task<World> GetWorldAsync(Guid worldId, Guid authenticatedUser)
    {
        var world = await dbContext.Worlds
            .Include(w => w.WorldUsers)
            .Where(w => w.WorldUsers.Any(wu => wu.UserId == authenticatedUser) && w.Id == worldId)
            .FirstAsync();

        return mapper.Map<World>(world);
    }

    public async Task<IEnumerable<World>> GetWorldsAsync(Guid authenticatedUser)
    {
        var worlds = await dbContext.Worlds
            .Include(w => w.WorldUsers.Where(wu => wu.UserId == authenticatedUser))
            .ToListAsync();

        return worlds.Select(mapper.Map<World>);
    }
}
