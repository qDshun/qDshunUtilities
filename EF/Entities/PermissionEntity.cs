namespace qDshunUtilities.EF.Entities;

public class PermissionEntity : BaseEntity
{
    public string Name { get; set; }

    public List<WorldObjectPermissionEntity> WorldObjectPermissions { get; set; } = [];
}
