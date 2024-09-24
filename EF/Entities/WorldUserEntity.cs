namespace qDshunUtilities.EF.Entities;

public class WorldUserEntity: BaseEntity
{
    public Guid UserId { get; set; }
    public UserEntity User { get; set; }
    public Guid WorldId { get; set; }
    public WorldEntity World { get; set; }

    public List<WorldObjectPermissionEntity> WorldObjectPermissions { get; set; } = [];
}
