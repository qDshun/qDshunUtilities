using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace qDshunUtilities;

public class AuthorizedController: ControllerBase
{
    public Guid AuthenticatedUser 
    { 
        get
        {
            return GetAuthenticatedUser();
        }
    }

    private Guid GetAuthenticatedUser()
    {
        var userIdClaimValue = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        Guid.TryParse(userIdClaimValue, out var userId);
        return userId;
    }
}
