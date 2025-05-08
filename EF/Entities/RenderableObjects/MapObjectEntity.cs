namespace qDshunUtilities.EF.Entities.RenderableObjects;

public enum SnappingOption 
{ 
    SnapToGrid,
    Coordinates
}

public class MapObjectEntity : BaseEntity
{
    public double X { get; set; }
    public double Y { get; set; }
    SnappingOption SnappingOption { get; set; }
    public ushort SnappingI { get; set; }
    public ushort SnappingJ { get; set; }

}
