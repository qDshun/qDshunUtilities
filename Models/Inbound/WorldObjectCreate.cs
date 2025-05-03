using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Models.Inbound;

public class WorldObjectCreate
{
    public WorldObjectType Type { get; set; }
    public string Name { get; set; }
    public Guid TemplateId { get; set; }
    public Guid? ParentId { get; set; }
    public Guid? PreviousId { get; set; }
    public Guid WorldId { get; set; }
    public string PreviewImageUrl { get; set; }
    public string TokenImageUrl { get; set; }
}
