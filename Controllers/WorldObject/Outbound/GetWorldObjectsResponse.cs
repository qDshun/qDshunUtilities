using qDshunUtilities.Models.WorldObject;
using qDshunUtilities.Utils;

namespace qDshunUtilities.Controllers.WorldObject.Outbound;

public class GetWorldObjectsResponse(IEnumerable<WorldObjectModel> models)
{
    public IEnumerable<WorldObjectDto> WorldObjects { get; set; } = models.Select(model => new WorldObjectDto(model));
    public class WorldObjectDto(WorldObjectModel wo)
    {
        public WorldObjectType Type { get; set; } = wo.Type;
        public Guid Id { get; set; } = wo.Id;
        public string Name { get; set; } = wo.Name;
        public Guid? ParentId { get; set; } = wo.ParentId;
        public Guid? PreviousId { get; set; } = wo.PreviousId;
        public string PreviewImageUrl { get; set; } = wo?.PreviewImageUrl;
    }
}
