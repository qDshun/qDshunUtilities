using qDshunUtilities.Hubs;
using Microsoft.AspNetCore.SignalR;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.EF;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.Helpers;
using qDshunUtilities.Hubs.Outbound.Notifications;

namespace qDshunUtilities.Services;

public interface INotificationService
{
    public Task SendNotificationAsync(Guid worldId, Guid worldObjectId, BaseNotification notification);
}
public class NotificationService(ApplicationDbContext dbContext, IHubContext<EventHub> hubContext) : INotificationService
{
    public const string onNotificationHubMethodName = "onNotification";

    public async Task SendNotificationAsync(Guid worldId, Guid worldObjectId, BaseNotification notification)
    {
        var users = await GetAffectedUsersList(worldId, worldObjectId);

        foreach (var user in users)
        {
            await hubContext.Clients.User(user.ToString()).SendAsync(onNotificationHubMethodName, worldId, notification);
        }

    }
    public async Task<List<WorldObjectPermissionEntity>> GetAffectedUsersList(Guid worldId, Guid worldObjectId)
    {
        return await dbContext.WorldObjectPermissions.Where(wop =>
            wop.WorldObject.WorldId == worldId
            && (wop.WorldObjectId == worldObjectId || wop.WorldObjectId == null)
            && wop.Permission.Name == Perms.AllowRead).ToListAsync();
    }
}
