namespace qDshunUtilities.EF.Entities.Map;

public enum GridType
{
    Square = 0,
    VerticalHex = 1,
    HorizontalHex = 2
}
public class MapEntity : BaseEntity
{
    public string Name { get; set; }
    public int CellSize { get; set; }
    public string StrokeColor { get; set; }
    public string BackgroundColor { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public GridType GridType { get; set; }
    public List<RenderableObjectEntity> RenderableObjects { get; set; }
    public Guid WorldId { get; set; }
    public WorldEntity World { get; set; }
}

