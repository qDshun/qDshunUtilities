namespace qDshunUtilities.EF.Entities;

public class LootItemEntity: BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public double Weight { get; set; }
    public double Cost { get; set; }
    public string CountExpression { get; set; }
    public int Rarity { get; set; }

    public Guid LootSourceId { get; set; }
    public LootSourceEntity LootSource { get; set; }
}
