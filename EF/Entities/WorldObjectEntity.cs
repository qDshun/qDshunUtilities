namespace qDshunUtilities.EF.Entities;

public class WorldObjectEntity : BaseEntity
{
    public string Name { get; set; }
    public string Path { get; set; }

    public Guid WorldId { get; set; }
    public WorldEntity World { get; set; }

    public List<ObjectFieldEntity> ObjectFields { get; set; } = [];
}
