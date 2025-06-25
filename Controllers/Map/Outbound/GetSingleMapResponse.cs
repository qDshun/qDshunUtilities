using qDshunUtilities.EF.Entities.Map;
using qDshunUtilities.Models.Map;

namespace qDshunUtilities.Controllers.Map.Outbound;

public class GetSingleMapResponse(MapModel model)
{
    public string Name { get; set; } = model.Name;
    public int CellSize { get; set; } = model.CellSize;
    public string StrokeColor { get; set; } = model.StrokeColor;
    public string BackgroundColor { get; set; } = model.BackgroundColor;
    public int Width { get; set; } = model.Width;
    public int Height { get; set; } = model.Height;
    public GridType GridType { get; set; } = model.GridType;
    public IEnumerable<RenderableObjectDto> RenderableObjects { get; set; } = model.RenderableObjects?.Select(models => new RenderableObjectDto(models));
    public Guid WorldId { get; set; } = model.WorldId;
    public class RenderableObjectDto(RenderableObjectModel model)
    {
        public RenderableObjectType Type { get; set; } = model.Type;
        public string ImageUrl { get; set; } = model.ImageUrl;
        public SnappingOptions Snapping { get; set; } = model.Snapping;
        public LayerType LayerType { get; set; } = model.LayerType;
        public Guid? MapId { get; set; } = model.MapId;
    }
}