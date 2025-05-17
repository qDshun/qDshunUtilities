using AutoMapper;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.EF.Entities.WorldObjects;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;
using System.Linq;

namespace qDshunUtilities.Services;

public interface IWorldObjectService
{
    Task<GetWorldObjectResponse> GetWorldObjectsAsync(Guid worldId, Guid authenticatedUser);
    Task CreateWorldObjectAsync(Guid worldId, WorldObjectCreateRequest worldObjectCreate, Guid authenticatedUser);
    Task<WorldObjectResponse> GetWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser);
    Task UpdateCharacterSheetAsync(Guid worldId, CharacterSheetUpdateRequest request, Guid authenticatedUser);
    Task DeleteWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser);
}

public class WorldObjectService(ApplicationDbContext dbContext, IMapper mapper, IAccessService accessService) : IWorldObjectService
{
    public async Task<GetWorldObjectResponse> GetWorldObjectsAsync(Guid worldId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        List<WorldObjectResponse> worldObjects = await dbContext.WorldObjects
            .Where(wo => wo.WorldId == worldId)
            .Include(wo => wo.WorldObjectPermissions)
            .ThenInclude(w => w.WorldUser)
            .Select(wo => new WorldObjectResponse(wo))
            .ToListAsync();
        return new GetWorldObjectResponse(worldObjects);
    }

    public async Task<WorldObjectResponse> GetWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowRead);

        var worldObject = await dbContext.WorldObjects
         .Where(wo => wo.Id == worldObjectId)
         .Include(wo => wo.WorldObjectPermissions)
         .ThenInclude(w => w.WorldUser)
         .Select(wo => new WorldObjectResponse(wo))
         .FirstAsync();

        return worldObject;
    }

    public async Task CreateWorldObjectAsync(Guid worldId, WorldObjectCreateRequest request, Guid authenticatedUser)
    {
        WorldObjectEntity worldObjectEntity = request.Type switch
        {
            WorldObjectType.Folder => GetFolderEntity(request),
            WorldObjectType.Handout => GetHandoutEntity(request),
            WorldObjectType.CharacterSheet => GetCharacterSheetEntity(request),
            _ => throw new NotImplementedException(),
        };
        var worldUser = await dbContext.WorldUsers.SingleAsync(wu => wu.UserId == authenticatedUser && wu.WorldId == worldId);
        worldObjectEntity.WorldId = worldId;

        var worldObjectPermissionEntities = await CreateWorldObjectPermissionEntitiesAsync([Perms.AllowEdit, Perms.AllowRead], worldId, worldUser.Id);

        worldObjectEntity.WorldObjectPermissions.AddRange(worldObjectPermissionEntities);

        dbContext.WorldObjects.Add(worldObjectEntity);
        await dbContext.SaveChangesAsync();
    }

    static private FolderEntity GetFolderEntity(WorldObjectCreateRequest request)
    {
        return new()
        {
            Name = request.Name,
            ParentId = request.ParentId,
            PreviousId = request.PreviousId,
            WorldId = request.WorldId,
            PreviewImageUrl = request.PreviewImageUrl
        };
    }

    static private HandoutEntity GetHandoutEntity(WorldObjectCreateRequest request)
    {
        return new()
        {
            Name = request.Name,
            ParentId = request.ParentId,
            PreviousId = request.PreviousId,
            WorldId = request.WorldId,
            PreviewImageUrl = request.PreviewImageUrl,
            TemplateId = request.TemplateId
        };
    }
    static private CharacterSheetEntity GetCharacterSheetEntity(WorldObjectCreateRequest request)
    {
        return new()
        {
            Name = request.Name,
            ParentId = request.ParentId,
            PreviousId = request.PreviousId,
            WorldId = request.WorldId,
            PreviewImageUrl = request.PreviewImageUrl,
            TemplateId = request.TemplateId,
            TokenImageUrl = request.TokenImageUrl
        };
    }


    public async Task UpdateCharacterSheetAsync(Guid worldId, CharacterSheetUpdateRequest request, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);
        await accessService.AssertHasWorldObjectPermissionAsync(request.Id, authenticatedUser, Perms.AllowRead);

        var characterSheetEntity = await dbContext.WorldObjects
            .OfType<CharacterSheetEntity>()
            .SingleAsync(w => w.Id == request.Id);

        characterSheetEntity.Name = request.Name;
        characterSheetEntity.ParentId = request.ParentId;
        characterSheetEntity.PreviousId = request.PreviousId;
        characterSheetEntity.PreviewImageUrl = request.PreviewImageUrl;
        characterSheetEntity.TokenImageUrl = request.TokenImageUrl;
        characterSheetEntity.TemplateId = request.TemplateId;

        dbContext.WorldObjects.Update(characterSheetEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteWorldObjectAsync(Guid worldId, Guid worldObjectId, Guid authenticatedUser)
    {
        await accessService.AssertHasAccessToWorldAsync(worldId, authenticatedUser);

        await accessService.AssertHasWorldObjectPermissionAsync(worldObjectId, authenticatedUser, Perms.AllowEdit);

        await dbContext.WorldObjectPermissions
            .Where(wo => wo.WorldObjectId == worldObjectId)
            .ExecuteDeleteAsync();
        await dbContext.WorldObjects
            .Where(wo => wo.Id == worldObjectId)
            .ExecuteDeleteAsync();
    }

    private async Task<IEnumerable<WorldObjectPermissionEntity>> CreateWorldObjectPermissionEntitiesAsync(List<string> permissions, Guid worldId, Guid worldUserId)
    {
        List<WorldObjectPermissionEntity> entities = [];
        foreach (var permission in permissions)
        {
            var PermissionEntity = await dbContext.Permissions.SingleAsync(p => p.Name == permission);

            WorldObjectPermissionEntity worldObjectPermissionEntity = new()
            {
                WorldObjectId = worldId,
                WorldUserId = worldUserId,
                Permission = PermissionEntity
            };

            entities.Add(worldObjectPermissionEntity);
        }

        return entities;
    }
}
