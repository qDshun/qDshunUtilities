namespace qDshunUtilities.EF.Entities;

public class LootSourceEntity: BaseEntity
{
    public List<LootItemEntity> LootItems { get; set; } = [];
}
