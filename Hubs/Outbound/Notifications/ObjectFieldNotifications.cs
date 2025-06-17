using qDshunUtilities.Models.ObjectField;

namespace qDshunUtilities.Hubs.Outbound.Notifications;

public abstract class ObjectFieldNotification : BaseNotification
{
    public Guid WorldObjectId { get; set; }
    public Guid ObjectFieldId { get; set; }
}

public class ObjectFieldCreatedNotification : ObjectFieldNotification
{
    public override string EventName { get; set; } = ObjectFieldCreated;
    public ObjectFieldModel ObjectField { get; set; }
}
public class ObjectFieldUpdatedNotification : ObjectFieldNotification
{
    public override string EventName { get; set; } = ObjectFieldUpdated;
    public ObjectFieldModel ObjectField { get; set; }
}

public class ObjectFieldDeletedNotification : ObjectFieldNotification
{
    public override string EventName { get; set; } = ObjectFieldDeleted;
}