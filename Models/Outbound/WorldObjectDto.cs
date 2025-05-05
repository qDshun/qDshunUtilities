using qDshunUtilities.EF.Entities.WorldObjects;
using System.Diagnostics;

namespace qDshunUtilities.Models.Outbound;

public enum WorldObjectType
{
    Folder,
    CharacterSheet,
    Handout
}
public class GetWorldObjectResponse
{
    public IEnumerable<WorldObjectDto> Objects { get; set; }

    public GetWorldObjectResponse()
    {
    }
    public GetWorldObjectResponse(IEnumerable<WorldObjectDto> objects)
    {
        Objects = objects;
    }
}
public class WorldObjectDto
{
    public WorldObjectDto()
    {
    }
    public WorldObjectType Type { get; set; }
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid? ParentId { get; set; }
    public Guid? PreviousId { get; set; }
    public string PreviewImageUrl { get; set; }

    public WorldObjectDto(WorldObjectEntity wo)
    {
        Type = wo switch
    {
        FolderEntity => WorldObjectType.Folder,
        CharacterSheetEntity => WorldObjectType.CharacterSheet,
        HandoutEntity => WorldObjectType.Handout,
        _ => throw new NotImplementedException(),
    };
        Id = wo.Id;
        Name = wo.Name;
        ParentId = wo.ParentId;
        PreviousId = wo.PreviousId;
        PreviewImageUrl = wo?.PreviewImageUrl;
    }
}
