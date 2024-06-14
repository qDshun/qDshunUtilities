namespace qDshunUtilities.Models.Outbound;

public class LootSource
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public IEnumerable<LootItem> LootItems { get; set; }
}
