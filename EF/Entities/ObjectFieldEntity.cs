using qDshunUtilities.EF.Entities.WorldObjects;

namespace qDshunUtilities.EF.Entities;

public class ObjectFieldEntity : BaseEntity
{
    public string Name { get; set; }
    public string Value { get; set; }
    public Guid? ParentId { get; set; }
    public ObjectFieldEntity Parent { get; set; }
    public Guid TemplatedWorldObjectId { get; set; }
    public TemplatedWorldObjectEntity TemplatedWorldObject { get; set; }
}
