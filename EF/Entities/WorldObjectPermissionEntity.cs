namespace qDshunUtilities.EF.Entities;

public class WorldObjectPermissionEntity : BaseEntity
{
    public Guid? WorldObjectId { get; set; }
    public WorldObjectEntity WorldObject { get; set; }

    public Guid WorldUserId { get; set; }
    public WorldUserEntity WorldUser { get; set; }

    public Guid PermissionId { get; set; }
    public PermissionEntity Permission { get; set; }
}
