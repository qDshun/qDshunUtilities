namespace qDshunUtilities.Models.Outbound.Notifications
{
    public abstract class WorldObjectNotification : BaseNotification
    {
        public Guid WorldObjectId { get; set; }
    }
    public class WorldObjectCreatedNotification : WorldObjectNotification
    {
        public override string EventName { get; set; } = WorldObjectCreated;
        public WorldObjectDto WorldObject { get; set; }
    }
    public class WorldObjectUpdatedNotification : WorldObjectNotification
    {
        public override string EventName { get; set; } = WorldObjectUpdated;
        public WorldObjectDto WorldObject { get; set; }
    }
    public class WorldObjectDeletedNotification : WorldObjectNotification    
    {
        public override string EventName { get; set; } = WorldObjectDeleted;

    }
}



