namespace qDshunUtilities.EF.Entities;

public class ObjectFieldEntity : BaseEntity
{
    public string Name { get; set; }
    public string Value { get; set; }

    public Guid WorldObjectId { get; set; }
    public WorldObjectEntity WorldObject { get; set; }
}
