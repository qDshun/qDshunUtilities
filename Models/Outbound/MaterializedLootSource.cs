namespace qDshunUtilities.Models.Outbound;

public class MaterializedLootSource
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Expression { get; set; }
    public int Count { get; set; }
    public IEnumerable<MaterializedLootItem> MaterializedLootItems { get; set; }
}
