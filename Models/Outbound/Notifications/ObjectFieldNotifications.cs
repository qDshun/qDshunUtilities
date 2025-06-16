namespace qDshunUtilities.Models.Outbound.Notifications
{
    public abstract class ObjectFieldNotification : BaseNotification
    {
        public Guid WorldObjectId { get; set; }
        public Guid ObjectFieldId { get; set; }
    }

    public class ObjectFieldCreatedNotification : ObjectFieldNotification
    {
        public override string EventName { get; set; } = ObjectFieldCreated;
        public ObjectFieldDto ObjectField { get; set; }
    }
    public class ObjectFieldUpdatedNotification : ObjectFieldNotification
    {
        public override string EventName { get; set; } = ObjectFieldUpdated;
        public ObjectFieldDto ObjectField { get; set; }
    }

    public class ObjectFieldDeletedNotification : ObjectFieldNotification
    {
        public override string EventName { get; set; } = ObjectFieldDeleted;
    }

}