namespace qDshunUtilities.Controllers.Chat.Inbound;

public class GetLastMessagesRequest
{
    public int MsgCount { get; set; }
    public Guid WorldId { get; set; }
}
