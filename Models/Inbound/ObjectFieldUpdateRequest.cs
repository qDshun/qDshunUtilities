using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class ObjectFieldUpdateRequest
{
    public Guid Id { get; set; }
    public Guid? ParentId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
}
