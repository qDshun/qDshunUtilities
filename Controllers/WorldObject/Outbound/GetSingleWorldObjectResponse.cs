using qDshunUtilities.Models.WorldObject;
using qDshunUtilities.Utils;

namespace qDshunUtilities.Controllers.WorldObject.Outbound;

public class GetSingleWorldObjectResponse(WorldObjectModel model)
{
    public WorldObjectType Type { get; set; } = model.Type;
    public Guid Id { get; set; } = model.Id;
    public string Name { get; set; } = model.Name;
    public Guid? ParentId { get; set; } = model.ParentId;
    public Guid? PreviousId { get; set; } = model.PreviousId;
    public string PreviewImageUrl { get; set; } = model?.PreviewImageUrl;
}
