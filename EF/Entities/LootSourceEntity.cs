namespace qDshunUtilities.EF.Entities;

public class LootSourceEntity: BaseEntity
{
    public IEnumerable<LootItemEntity> LootItems { get; set; } = [];
}
