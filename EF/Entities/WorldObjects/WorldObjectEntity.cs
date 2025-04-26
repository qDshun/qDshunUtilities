namespace qDshunUtilities.EF.Entities.WorldObjects;

public class WorldObjectEntity : BaseEntity
{
    public string Name { get; set; }
    public Guid? ParentId { get; set; }
    public WorldObjectEntity Parent { get; set; }
    public Guid WorldId { get; set; }
    public WorldEntity World { get; set; }
    public string PreviewImageUrl { get; set; }
    public List<WorldObjectPermissionEntity> WorldObjectPermissions { get; set; } = [];

}
