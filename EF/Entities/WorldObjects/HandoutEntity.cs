using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.EF.Entities.WorldObjects;

public class HandoutEntity : TemplatedWorldObjectEntity
{
    public HandoutEntity()
    {
    }

    public HandoutEntity(WorldObjectCreate obj) : base(obj)
    {
    }
}
