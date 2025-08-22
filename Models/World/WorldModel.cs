using qDshunUtilities.Models.Loot;

namespace qDshunUtilities.Models.World;

public class WorldModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public IEnumerable<LootSourceModel> LootSources { get; set; }
}
