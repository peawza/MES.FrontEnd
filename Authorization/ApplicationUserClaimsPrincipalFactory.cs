using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Security.Claims;
using WEB.APP.Extensions;
using WEB.APP.Extensions.Identity;

namespace WEB.APP.MvcWebApp.Identity
{
    public class ApplicationUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
    {
        //private readonly MSDBContext _context;
        //private readonly ICommonService _commonService;
        public ApplicationUserClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor
            //MSDBContext context
            //, ICommonService commonService

            )
            : base(userManager, roleManager, optionsAccessor)
        {
            //_commonService = commonService;
            //_context = context;
        }
        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            var roleNames = await UserManager.GetRolesAsync(user);
            var roleIds = RoleManager.Roles.Where(t => roleNames.Any(k => k == t.Name)).Select(t => t.Id).ToArray();
            // Get permission from roles


            IEnumerable<GetGroupPermission_View> GetGroupPermission = null; //_commonService.sp_Common_GetGroupPermission(user.Id);
            var permissions = new Dictionary<string, int[]>();
            foreach (var Data in GetGroupPermission)
            {
                try
                {
                    if (permissions.ContainsKey(Data.ScreenID))
                    {
                        permissions[Data.ScreenID] = permissions[Data.ScreenID].Concat(new int[] { Data.FunctionCode }).ToArray();
                    }
                    else
                    {
                        int[] FunctionCode = { Data.FunctionCode };
                        permissions.Add(Data.ScreenID, FunctionCode);
                    }

                }
                catch (System.Exception ex)
                {

                    // throw;
                }

            }

            //var permissions = _context.GroupPermissions.Where(t => roleIds.Any(k => k == t.GroupId)).ToDictionary(t => t.ScreenId, k => k.FunctionCode);
            // Dictionary<string, int> permissions = _context.GroupPermissions.Where(t => roleIds.Any(k => k == t.GroupId)).ToDictionary(t => t.ScreenId, k => k.FunctionCode);

            Department department = null; //_context.Departments.FirstOrDefault(t => t.DepartmentNo == user.DepartmentNo);
            Position position = null; //_context.Positions.FirstOrDefault(t => t.PositionNo == user.PositionNo);
            var claimsIdentity = await base.GenerateClaimsAsync(user);
            claimsIdentity.AddClaim(new Claim(ClaimTypes.UserData, JsonConvert.SerializeObject(user.ToUserData(permissions, department, position))));
            return claimsIdentity;
        }



    }
}
