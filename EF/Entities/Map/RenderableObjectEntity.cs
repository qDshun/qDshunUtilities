namespace qDshunUtilities.EF.Entities.Map;

public enum RenderableObjectType
{
    Image = 0,
    Token = 1
}
public enum LayerType
{
    Background = 0,
    GM = 1,
    Interactable = 2
}

public enum SnappingOptions
{
    Tile = 0,
    Free = 1
}
public class RenderableObjectEntity : BaseEntity
{
    public RenderableObjectType Type { get; set; }
    public string ImageUrl { get; set; }
    public SnappingOptions Snapping { get; set; }
    public LayerType LayerType { get; set; }
    public Guid? MapId { get; set; }
    public MapEntity Map { get; set; }

}
