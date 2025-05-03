using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.EF.Entities.WorldObjects;

public class FolderEntity : WorldObjectEntity
{
    public FolderEntity()
    {
    }

    public FolderEntity(WorldObjectCreate obj) : base(obj)
    {
    }
}
