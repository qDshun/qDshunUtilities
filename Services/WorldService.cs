using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models;

namespace qDshunUtilities.Services;

public interface IWorldService
{
    Task<IEnumerable<World>> GetWorldsAsync(Guid authenticatedUser);
    Task<World> GetWorldAsync(Guid worldId, Guid authenticatedUser);
    Task CreateWorld(WorldCreate worldCreate, Guid authenticatedUser);
    Task UpdateWorld(Guid worldId, WorldUpdate worldupdate, Guid authenticatedUser);
    Task DeleteWorld(Guid worldId, Guid authenticatedUser);
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

    public async Task CreateWorld(WorldCreate worldCreate, Guid authenticatedUser)
    {
        var worldEntity = mapper.Map<WorldEntity>(worldCreate);
        var user = await dbContext.Users.SingleAsync(u => u.Id == authenticatedUser);

        var worldUserEntity = new WorldUserEntity { User = user, World = worldEntity };
        user.WorldUsers.Add(worldUserEntity);
        dbContext.WorldUsers.Update(worldUserEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateWorld(Guid worldId, WorldUpdate worldupdate, Guid authenticatedUser)
    {
        var worldEntity = await dbContext.Worlds
            .Include(w => w.WorldUsers.Where(wu => wu.UserId == authenticatedUser))
            .SingleAsync(w => w.Id == worldId);

        mapper.Map(worldupdate, worldEntity);

        dbContext.Worlds.Update(worldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteWorld(Guid worldId, Guid authenticatedUser)
    {
        var worldEntity = await dbContext.Worlds
            .Include(w => w.WorldUsers.Where(wu => wu.UserId == authenticatedUser))
            .SingleAsync(w => w.Id == worldId);

        dbContext.Worlds.Remove(worldEntity);
        await dbContext.SaveChangesAsync();
    }
}
