using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.EF.Entities.WorldObjects;

public class TemplatedWorldObjectEntity : WorldObjectEntity
{
    public TemplatedWorldObjectEntity()
    {
    }

    public TemplatedWorldObjectEntity(WorldObjectCreate obj) : base(obj)
    {
        TemplateId = obj.TemplateId;
    }
    public Guid TemplateId { get; set; }
    public TemplateEntity Template { get; set; }
    public List<ObjectFieldEntity> ObjectFields { get; set; } = [];
}
