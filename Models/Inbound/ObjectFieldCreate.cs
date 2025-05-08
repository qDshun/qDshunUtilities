using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class ObjectFieldCreate
{
    public Guid? ParentId { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public Guid TemplatedWorldObjectId { get; set; }

    public ObjectFieldEntity ToEntity()
    {
        var entity = new ObjectFieldEntity
        {
            ParentId = ParentId,
            Name = Name,
            Value = Value,
            TemplatedWorldObjectId = TemplatedWorldObjectId
        };
        return entity;
    }

}


