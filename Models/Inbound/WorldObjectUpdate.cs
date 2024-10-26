namespace qDshunUtilities.Models.Inbound;

public class WorldObjectUpdate
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Path { get; set; }
    public Guid WorldId { get; set; }
    public Guid TemplateId { get; set; }
}
