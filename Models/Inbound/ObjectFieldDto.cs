using qDshunUtilities.EF.Entities.WorldObjects;
using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class ObjectFieldDto(ObjectFieldEntity of)
{
    public Guid id { get; set; } = of.Id;
    public Guid? ParentId { get; set; } = of.ParentId;
    public string Name { get; set; } = of.Name;
    public string Value { get; set; } = of.Value;
    public Guid TemplatedWorldObjectId { get; set; } = of.TemplatedWorldObjectId;

}