using qDshunUtilities.EF.Entities.WorldObjects;
using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Inbound;

public class WorldObjectUpdateRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid? PreviousId { get; set; }
    public Guid? ParentId { get; set; }
    public string PreviewImageUrl { get; set; }
}
public class CharacterSheetUpdateRequest : TemplatedObjectUpdateRequest
{
    public string TokenImageUrl { get; set; }
}

public class TemplatedObjectUpdateRequest : WorldObjectUpdateRequest
{
    public Guid TemplateId { get; set; }
}
public class HandoutUpdateRequest : TemplatedObjectUpdateRequest
{
}

public class FolderUpdateRequest : TemplatedObjectUpdateRequest
{
}