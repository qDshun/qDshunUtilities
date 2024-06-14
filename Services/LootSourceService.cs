using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Services;

public interface ILootSourceService
{
    Task CreateLootSourceAsync(Guid worldId, LootSourceCreate lootSourceCreate, Guid authenticatedUser);
    Task UpdateLootSourceAsync(Guid lootSourceId, LootSourceUpdate lootSourceUpdate, Guid authenticatedUser);
    Task DeleteLootSourceAsync(Guid lootSourceId, Guid authenticatedUser);
    Task<MaterializedLootSource> MaterializeLootSourceAsync(Guid lootSourceId, Guid authenticatedUser, string lootExpression);
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

    public async Task<MaterializedLootSource> MaterializeLootSourceAsync(Guid lootSourceId, Guid authenticatedUser, string lootExpression)
    {
        var lootSourceEntity = await dbContext.LootSources
            .Where(ls => ls.Id == lootSourceId && ls.World.WorldUsers.Any(wu => wu.UserId == authenticatedUser))
            .Include(ls => ls.World)
            .Include(ls => ls.LootItems)
            .SingleAsync();
        var itemCount = DiceExpressionEvaluator.EvaluateDiceExpression(lootExpression);
        lootSourceEntity.LootItems = GetRandomisedItems(lootSourceEntity, itemCount);


        var materializedLootSource = mapper.Map<MaterializedLootSource>(lootSourceEntity);
        materializedLootSource.Expression = lootExpression;
        materializedLootSource.Count = itemCount;
        materializedLootSource.MaterializedLootItems = CombineAndSumDuplicates(materializedLootSource.MaterializedLootItems);

        return materializedLootSource;
    }

    private List<MaterializedLootItem> CombineAndSumDuplicates(IEnumerable<MaterializedLootItem> lootItems)
    {
        Dictionary<Guid, MaterializedLootItem> lootItemsById = [];

        foreach (var item in lootItems)
        {
            if (lootItemsById.ContainsKey(item.Id))
            {
                lootItemsById[item.Id].Count += item.Count;
            }
            else
            {
                lootItemsById[item.Id] = new MaterializedLootItem
                {
                    Id = item.Id,
                    Name = item.Name,
                    Count = item.Count,
                };
            }
        }

        return lootItemsById.Values.ToList();
    }

    private List<LootItemEntity> GetRandomisedItems(LootSourceEntity lootSourceEntity, int count)
    {
        if (lootSourceEntity.LootItems.Count == 0 || count <= 0)
        {
            return [];
        }
        var random = new Random();
        var selectedLootItems = new List<LootItemEntity>();

        for (int i = 0; i < count; i++)
        {
            var randomIndex = random.Next(lootSourceEntity.LootItems.Count);
            var selectedItem = lootSourceEntity.LootItems[randomIndex];
            selectedLootItems.Add(selectedItem);
        }
        return selectedLootItems;
    }
}
