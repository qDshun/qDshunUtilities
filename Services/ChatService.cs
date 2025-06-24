using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Chat;

namespace qDshunUtilities.Services;

public interface IChatService
{
    Task<ChatMessageEntity> CreateChatMessageAsync(string chatMessage, Guid worldId, Guid authenticatedUser);
    Task<List<ChatMessageModel>> GetLastChatMessagesAsync(int numberOfLastMesssages, Guid worldId, Guid authenticatedUser);
}
public class ChatService(ApplicationDbContext dbContext) : IChatService
{
    public async Task<ChatMessageEntity> CreateChatMessageAsync(string chatMessage, Guid worldId, Guid authenticatedUser)
    {
        var worldUser = await dbContext.WorldUsers
            .SingleAsync(wu => wu.UserId == authenticatedUser && wu.WorldId == worldId);
        ChatMessageEntity chatLineEntity = new() { WorldUserId = worldUser.Id, Text = chatMessage, CreatedAt = DateTime.Now };
        dbContext.ChatMessages.Add(chatLineEntity);
        await dbContext.SaveChangesAsync();
        return chatLineEntity;
    }

    public async Task<List<ChatMessageModel>> GetLastChatMessagesAsync(int numberOfLastMesssages, Guid worldId, Guid authenticatedUser)
    {
        List<ChatMessageModel> chatLines = await dbContext.ChatMessages
            .Where(cl => cl.WorldUser.WorldId == worldId)
            .OrderBy(cl => cl.CreatedAt)
            .Take(numberOfLastMesssages)
            .Select(cl => new ChatMessageModel(cl))
            .ToListAsync();
        return chatLines;
    }
}
