using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Hubs.Outbound;

public class ChatMessage(ChatMessageEntity entity)
{
    public string UserName { get; set; } = "Placeholder";
    public string Message { get; set; } = entity.Text;
    public DateTime CreatedAt { get; set; } = entity.CreatedAt;
}
