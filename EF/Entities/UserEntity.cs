using Microsoft.AspNetCore.Identity;

namespace qDshunUtilities.EF.Entities;

public class UserEntity: IdentityUser<Guid>
{
    public List<WorldUserEntity> WorldUsers { get; set; } = [];
}
