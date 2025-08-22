using qDshunUtilities.EF.Entities.Map;
using qDshunUtilities.Models.Map;

namespace qDshunUtilities.Controllers.Map.Inbound;

public class MapCreateRequest
{
    public string Name { get; set; }
    public int CellSize { get; set; }
    public string StrokeColor { get; set; }
    public string BackgroundColor { get; set; }
    public int Width { get; set; }
    public int Height { get; set; } 
    public GridType GridType { get; set; }
}
