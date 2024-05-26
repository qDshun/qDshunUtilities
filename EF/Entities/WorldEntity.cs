namespace qDshunUtilities.EF.Entities;

public class WorldEntity: BaseEntity
{
    public IEnumerable<WorldUserEntity> WorldUsers { get; set; } = [];
    public IEnumerable<LootSourceEntity> LootSources { get; set; } = [];
}
