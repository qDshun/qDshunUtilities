using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class ObjectFieldUpdate
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
}
