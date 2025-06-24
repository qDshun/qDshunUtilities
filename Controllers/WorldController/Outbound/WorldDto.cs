using qDshunUtilities.Models.Loot;
using qDshunUtilities.Models.LootItem;
using qDshunUtilities.Models.World;

namespace qDshunUtilities.Controllers.WorldController.Outbound
{
    public class WorldDto(WorldModel model)
    {
        public Guid Id { get; set; } = model.Id;
        public string Name { get; set; } = model.Name;
        public string ImageUrl { get; set; } = model?.ImageUrl;
        public IEnumerable<LootSourceDto> LootSources { get; set; } = model.LootSources.Select(source => new LootSourceDto(source));
        public class LootSourceDto(LootSourceModel model)
        {
            public Guid Id { get; set; } = model.Id;
            public string Name { get; set; } = model.Name;
            public IEnumerable<LootItemDto> LootItems { get; set; } = model.LootItems.Select(item => new LootItemDto(item));
        }
        public class LootItemDto(LootItemModel model)
        {
            public Guid Id { get; set; } = model.Id;
            public string Name { get; set; } = model.Name;
            public string Description { get; set; } = model.Description;
            public double Weight { get; set; } = model.Weight;
            public double Cost { get; set; } = model.Cost;
            public string CountExpression { get; set; } = model.CountExpression;
        }
    }
}
