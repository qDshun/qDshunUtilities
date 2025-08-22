namespace qDshunUtilities.Models.Loot;

public class MaterializedLootItemModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double Weight { get; set; }
    public double Cost { get; set; }
    public int Count { get; set; }
}