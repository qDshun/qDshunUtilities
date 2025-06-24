using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.Models.Chat;

public class ChatMessageModel(ChatMessageEntity entity)
{
    public string UserName { get; set; } = "Placeholder";
    public string Message { get; set; } = entity.Text;
    public DateTime CreatedAt { get; set; } = entity.CreatedAt;
}
