using System.Security.Claims;

namespace leaguerAPI.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetObjectId(this ClaimsPrincipal principal)
        {
            var claim = principal.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")
                ?? throw new InvalidOperationException("ObjectIdentifier claim is missing.");
            return Guid.Parse(claim.Value);
        }
    }
}
