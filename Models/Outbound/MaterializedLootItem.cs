namespace qDshunUtilities.Models.Outbound;

public class MaterializedLootItem
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double Weight { get; set; }
    public double Cost { get; set; }
    public int Count { get; set; }
}