namespace qDshunUtilities.Models.Loot;

public class MaterializedLootSourceModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Expression { get; set; }
    public int Count { get; set; }
    public IEnumerable<MaterializedLootItemModel> MaterializedLootItems { get; set; }
}
