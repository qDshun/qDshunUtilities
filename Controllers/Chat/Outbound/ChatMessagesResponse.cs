using qDshunUtilities.Models.Chat;

namespace qDshunUtilities.Controllers.Chat.Outbound
{
    public class ChatMessagesResponse(IEnumerable<ChatMessageModel> models)
    {
        public IEnumerable<ChatMessageDto> Messages = models.Select(model => new ChatMessageDto(model));
        public class ChatMessageDto(ChatMessageModel model)
        {
            public string UserName { get; set; } = model.UserName;
            public string Message { get; set; } = model.Message;
            public DateTime CreatedAt { get; set; } = model.CreatedAt;
        }
    }
}
