namespace qDshunUtilities.Hubs.Outbound.Notifications;

public abstract class BaseNotification
{
    public abstract string EventName { get; set; }
    public const string ObjectFieldCreated = "ObjectFieldCreated";
    public const string ObjectFieldUpdated = "ObjectFieldUpdated";
    public const string ObjectFieldDeleted = "ObjectFieldDeleted";

    public const string WorldObjectCreated = "WorldObjectCreated";
    public const string WorldObjectUpdated = "WorldObjectUpdated";
    public const string WorldObjectDeleted = "WorldObjectDeleted";

    public const string NewChatMessage = "NewChatMessage";
}
