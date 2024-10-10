using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class WorldObjectPermission
{

    public Guid WorldUserId { get; set; }
    public Permission Permission { get; set; }

}
