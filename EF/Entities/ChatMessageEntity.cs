using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;

namespace qDshunUtilities.EF.Entities;

public class ChatMessageEntity: BaseEntity
{
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid WorldUserId { get; set; }
    public WorldUserEntity WorldUser { get; set; }

}
