using qDshunUtilities.Models.Loot;

namespace qDshunUtilities.Controllers.Dice.Outbound;

public class MaterializeLootSourceResponse(MaterializedLootSourceModel model)
{
    public Guid Id { get; set; } = model.Id;
    public string Name { get; set; } = model?.Name;
    public string Expression { get; set; } = model.Expression;
    public int Count { get; set; } = model.Count;
    public IEnumerable<MaterializedLootItemDto> MaterializedLootItems { get; set; } =
        model.MaterializedLootItems.Select(lootItem => new MaterializedLootItemDto(lootItem));
    public class MaterializedLootItemDto(MaterializedLootItemModel model)
    {
        public Guid Id { get; set; } = model.Id;
        public string Name { get; set; } = model.Name;
        public string Description { get; set; } = model.Description;
        public double Weight { get; set; } = model.Weight;
        public double Cost { get; set; } = model.Cost;
        public int Count { get; set; } = model.Count;
    }
}
