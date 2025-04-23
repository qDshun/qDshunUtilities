using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;

namespace qDshunUtilities.EF.Entities;

public class ChatMessageEntity: BaseEntity
{
    public WorldUserEntity WorldUser { get; set; }
    public Guid WorldUserId { get; set; }
    public string MessageText { get; set; }
    public DateTime CreatedAt { get; set; }

}
