using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.Services;

public interface ILootItemService
{
    Task CreateLootItemAsync(Guid lootSourceId, LootItemCreate lootItemCreate, Guid authenticatedUser);
    Task UpdateLootItemAsync(Guid lootItemId, LootItemUpdate lootItemUpdate, Guid authenticatedUser);
    Task DeleteLootItemAsync(Guid lootItemId, Guid authenticatedUser);
}

public class LootItemService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : ILootItemService
{
    public async Task CreateLootItemAsync(Guid lootSourceId, LootItemCreate lootItemCreate, Guid authenticatedUser)
    {
        var lootSourceEntity = await dbContext.LootSources
            .Where(ls => ls.World.WorldUsers.Any(wu => wu.UserId == authenticatedUser))
            .SingleAsync(ls => ls.Id == lootSourceId);

        await accessService.AssertHasAccessToWorldAsync(lootSourceEntity.WorldId, authenticatedUser);

        var lootItemEntity = mapper.Map<LootItemEntity>(lootItemCreate);
        lootItemEntity.LootSourceId = lootSourceId;

        dbContext.LootItems.Add(lootItemEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateLootItemAsync(Guid lootItemId, LootItemUpdate lootItemUpdate, Guid authenticatedUser)
    {
        var lootItemEntity = await dbContext.LootItems
            .Where(li => li.Id == lootItemId && li.LootSource.World.WorldUsers.Any(wu => wu.UserId == authenticatedUser))
            .Include(li => li.LootSource)
            .SingleAsync();

        mapper.Map(lootItemUpdate, lootItemEntity);

        dbContext.LootItems.Update(lootItemEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteLootItemAsync(Guid lootItemId, Guid authenticatedUser)
    {
        var lootItemEntity = await dbContext.LootItems
            .Where(li => li.Id == lootItemId && li.LootSource.World.WorldUsers.Any(wu => wu.UserId == authenticatedUser))
            .SingleAsync();

        dbContext.LootItems.Remove(lootItemEntity);
        await dbContext.SaveChangesAsync();
    }
}
