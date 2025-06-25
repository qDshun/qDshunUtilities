using qDshunUtilities.EF.Entities.Map;
using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Map
{
    public class RenderableObjectModel(RenderableObjectEntity entity)
    {
        public RenderableObjectType Type { get; set; } = entity.Type;
        public string ImageUrl { get; set; } = entity.ImageUrl;
        public SnappingOptions Snapping { get; set; } = entity.Snapping;
        public LayerType LayerType { get; set; } = entity.LayerType;
        public Guid? MapId { get; set; } = entity.MapId;
    }
}
