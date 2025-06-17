using qDshunUtilities.Models.ObjectField;

namespace qDshunUtilities.Controllers.ObjectField.Outbound;

public class GetObjectFieldsResponse(IEnumerable<ObjectFieldModel> models)
{
    public IEnumerable<ObjectFieldDto> Fields { get; set; } = models.Select(model => new ObjectFieldDto(model));
    public class ObjectFieldDto(ObjectFieldModel model)
    {
        public Guid Id { get; set; } = model.Id;
        public Guid? ParentId { get; set; } = model.ParentId;
        public string Name { get; set; } = model.Name;
        public string Value { get; set; } = model.Value;
        public Guid TemplatedWorldObjectId { get; set; } = model.TemplatedWorldObjectId;
    }
}
