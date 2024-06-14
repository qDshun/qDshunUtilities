using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.Services;

public interface ILootSourceService
{
    Task CreateLootSourceAsync(Guid worldId, LootSourceCreate lootSourceCreate, Guid authenticatedUser);
    Task UpdateLootSourceAsync(Guid lootSourceId, LootSourceUpdate lootSourceUpdate, Guid authenticatedUser);
    Task DeleteLootSourceAsync(Guid lootSourceId, Guid authenticatedUser);
}

public class LootSourceService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : ILootSourceService
{
    public async Task CreateLootSourceAsync(Guid worldId, LootSourceCreate lootSourceCreate, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        var lootSourceEntity = mapper.Map<LootSourceEntity>(lootSourceCreate);
        lootSourceEntity.WorldId = worldId;

        dbContext.LootSources.Add(lootSourceEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateLootSourceAsync(Guid lootSourceId, LootSourceUpdate lootSourceUpdate, Guid authenticatedUser)
    {
        var lootSourceEntity = await dbContext.LootSources
            .Where(ls => ls.Id == lootSourceId && ls.World.WorldUsers.Any(wu => wu.UserId == authenticatedUser))
            .Include(ls => ls.World)
                .ThenInclude(w => w.WorldUsers)
            .SingleAsync();

        mapper.Map(lootSourceUpdate, lootSourceEntity);

        dbContext.LootSources.Update(lootSourceEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteLootSourceAsync(Guid lootSourceId, Guid authenticatedUser)
    {
        var lootSourceEntity = await dbContext.LootSources
            .Where(ls => ls.Id == lootSourceId && ls.World.WorldUsers.Any(wu => wu.UserId == authenticatedUser))
            .Include(ls => ls.World)
                .ThenInclude(w => w.WorldUsers)
            .SingleAsync();

        dbContext.LootSources.Remove(lootSourceEntity);
        await dbContext.SaveChangesAsync();
    }
}
