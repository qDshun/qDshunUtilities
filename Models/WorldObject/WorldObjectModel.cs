using qDshunUtilities.EF.Entities.WorldObjects;
using qDshunUtilities.Utils;

namespace qDshunUtilities.Models.WorldObject;


public class WorldObjectModel(WorldObjectEntity wo)
{
    public WorldObjectType Type { get; set; } = wo switch
    {
        FolderEntity => WorldObjectType.Folder,
        CharacterSheetEntity => WorldObjectType.CharacterSheet,
        HandoutEntity => WorldObjectType.Handout,
        _ => throw new NotImplementedException(),
    };
    public Guid Id { get; set; } = wo.Id;
    public string Name { get; set; } = wo.Name;
    public Guid? ParentId { get; set; } = wo.ParentId;
    public Guid? PreviousId { get; set; } = wo.PreviousId;
    public string PreviewImageUrl { get; set; } = wo?.PreviewImageUrl;

}
