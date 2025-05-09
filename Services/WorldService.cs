﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Exceptions;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Services;

public interface IWorldService
{
    Task<IEnumerable<World>> GetWorldsAsync(Guid authenticatedUser);
    Task<World> GetWorldAsync(Guid worldId, Guid authenticatedUser);
    Task CreateWorldAsync(WorldCreate worldCreate, Guid authenticatedUser);
    Task UpdateWorldAsync(Guid worldId, WorldUpdate worldUpdate, Guid authenticatedUser);
    Task DeleteWorldAsync(Guid worldId, Guid authenticatedUser);
    Task InviteUserToWorldAsync(Guid worldId, InviteUserToWorldRequest request, Guid authenticatedUser);
}

public class WorldService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : IWorldService
{
    public async Task<IEnumerable<World>> GetWorldsAsync(Guid authenticatedUser)
    {
        var worlds = await dbContext.Worlds
            .Include(w => w.WorldUsers.Where(wu => wu.UserId == authenticatedUser))
            .Include(w => w.LootSources)
                .ThenInclude(ls => ls.LootItems)
            .ToListAsync();

        return worlds.Select(mapper.Map<World>);
    }

    public async Task<World> GetWorldAsync(Guid worldId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        var world = await dbContext.Worlds
            .Include(w => w.WorldUsers)
            .Where(w => w.WorldUsers.Any(wu => wu.UserId == authenticatedUser) && w.Id == worldId)
            .Include(w => w.LootSources)
                .ThenInclude(ls => ls.LootItems)
            .FirstAsync();

        return mapper.Map<World>(world);
    }

    public async Task CreateWorldAsync(WorldCreate worldCreate, Guid authenticatedUser)
    {
        var worldEntity = mapper.Map<WorldEntity>(worldCreate);
        var user = await dbContext.Users.SingleAsync(u => u.Id == authenticatedUser);

        var worldUserEntity = new WorldUserEntity { User = user, World = worldEntity };
        user.WorldUsers.Add(worldUserEntity);
        dbContext.WorldUsers.Update(worldUserEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateWorldAsync(Guid worldId, WorldUpdate worldUpdate, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        var worldEntity = await dbContext.Worlds
            .Include(w => w.WorldUsers.Where(wu => wu.UserId == authenticatedUser))
            .SingleAsync(w => w.Id == worldId);

        mapper.Map(worldUpdate, worldEntity);

        dbContext.Worlds.Update(worldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteWorldAsync(Guid worldId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        var worldEntity = await dbContext.Worlds
            .Include(w => w.WorldUsers.Where(wu => wu.UserId == authenticatedUser))
            .SingleAsync(w => w.Id == worldId);

        dbContext.Worlds.Remove(worldEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task InviteUserToWorldAsync(Guid worldId, InviteUserToWorldRequest request, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        var targetUserEntity = await dbContext.Users
            .Where(u => u.Id == request.UserId)
            .Include(u => u.WorldUsers.Where(wu => wu.WorldId == worldId))
            .FirstOrDefaultAsync() ?? throw new BadRequestException($"User {request.UserId} does not exist");

        if (targetUserEntity.WorldUsers.Count != 0)
        {
            throw new BadRequestException($"User {request.UserId} is already a member of world {worldId}");
        }

        var worldUserEntity = new WorldUserEntity { WorldId = worldId};

        targetUserEntity.WorldUsers.Add(worldUserEntity);
        await dbContext.SaveChangesAsync();
    }
}
