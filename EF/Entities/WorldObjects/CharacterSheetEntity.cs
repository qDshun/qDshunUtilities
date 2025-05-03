using qDshunUtilities.Models.Inbound;

namespace qDshunUtilities.EF.Entities.WorldObjects;

public class CharacterSheetEntity : TemplatedWorldObjectEntity
{
    public CharacterSheetEntity()
    {
    }

    public CharacterSheetEntity(WorldObjectCreate obj) : base(obj)
    {
        TokenImageUrl = obj.TokenImageUrl;
    }
    public string TokenImageUrl { get; set; }
}
