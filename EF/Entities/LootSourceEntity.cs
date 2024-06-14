namespace qDshunUtilities.EF.Entities;

public class LootSourceEntity: BaseEntity
{
    public string Name { get; set; }
    public List<LootItemEntity> LootItems { get; set; } = [];


    public Guid WorldId { get; set; }
    public WorldEntity World { get; set; }
}
