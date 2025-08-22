using qDshunUtilities.Models.LootItem;

namespace qDshunUtilities.Models.Loot;

public class LootSourceModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public IEnumerable<LootItemModel> LootItems { get; set; }
}
