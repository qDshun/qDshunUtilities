using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class ObjectFieldCreateRequest
{
    public Guid? ParentId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public Guid TemplatedWorldObjectId { get; set; }
}


