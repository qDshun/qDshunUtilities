using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using qDshunUtilities.Services;
using System.Security.Claims;


namespace qDshunUtilities;

public class AuthorizedHub: Hub
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
        var userIdClaimValue = Context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        Guid.TryParse(userIdClaimValue, out var userId);
        return userId;
    }
}
