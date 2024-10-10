using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class WorldObjectUpdate
{
    public string Name { get; set; }
    public string Path { get; set; }
    public Guid TemplateId { get; set; }
    public List<ObjectField> ObjectFields { get; set; } = [];
    public List<WorldObjectPermission> WorldObjectPermissions { get; set; } = [];

}
