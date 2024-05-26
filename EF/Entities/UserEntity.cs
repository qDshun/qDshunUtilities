using Microsoft.AspNetCore.Identity;

namespace qDshunUtilities.EF.Entities;

public class UserEntity: IdentityUser<Guid>
{
    public IEnumerable<WorldUserEntity> WorldUsers { get; set; } = [];
}
