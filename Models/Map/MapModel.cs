using qDshunUtilities.EF.Entities.Map;
using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Map;

public class MapModel(MapEntity entity)
{
    public string Name { get; set; } = entity.Name;
    public int CellSize { get; set; } = entity.CellSize;
    public string StrokeColor { get; set; } = entity.StrokeColor;
    public string BackgroundColor { get; set; } = entity.BackgroundColor;
    public int Width { get; set; } = entity.Width;
    public int Height { get; set; } = entity.Height;
    public GridType GridType { get; set; } = entity.GridType;
    public IEnumerable<RenderableObjectModel> RenderableObjects { get; set; } = entity.RenderableObjects?.Select(obj => new RenderableObjectModel(obj));
    public Guid WorldId { get; set; }
}
