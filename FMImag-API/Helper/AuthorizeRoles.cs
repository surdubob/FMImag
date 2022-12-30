using FMImag.Model;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FMImag.Helper
{

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeRoles : Attribute, IAuthorizationFilter
    {
        private IList<UserRole> _roles;

        public AuthorizeRoles(params UserRole[] roles)
        {
            _roles = roles ?? Array.Empty<UserRole>();
        }

        public void OnAuthorization(AuthorizationFilterContext filterContext)
        {
            var allowAnonymous = filterContext.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            var user = (User)filterContext.HttpContext.Items["User"];
            if (user == null || (_roles.Any() && !_roles.Contains((UserRole)user.UserRole)))
                filterContext.Result = new Microsoft.AspNetCore.Mvc.UnauthorizedResult();
        }
    }
    
}
