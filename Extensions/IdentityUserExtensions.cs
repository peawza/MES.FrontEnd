


using Newtonsoft.Json;
using System.Security.Claims;
using WEB.APP.Extensions.Identity;

namespace WEB.APP.Extensions
{
    public static class IdentityUserExtensions
    {
        public static UserData ToUserData(this ApplicationUser user, Dictionary<string, int[]> permissions, Department department, Position position)
        {
            return new UserData(permissions)
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DepartmentNo = user.DepartmentNo,
                DepartmentName = department?.DepartmentName,
                PositionNo = user.PositionNo,
                PositionName = position?.PositionName,
            };
        }

        public static UserData GetUserData(this ClaimsPrincipal p)
        {
            if (!p.HasClaim(t => t.Type == ClaimTypes.UserData))
            {
                return new UserData();
            }

            var c = p.FindFirst(ClaimTypes.UserData);
            return JsonConvert.DeserializeObject<UserData>(c.Value);
        }

        public static string GetDisplayName(this ClaimsPrincipal p)
        {
            var userData = GetUserData(p);
            if (String.IsNullOrWhiteSpace(userData.FirstName))
            {
                return p.Identity.Name;
            }
            return userData.DisplayName;
        }

        public static int[] GetPagePermission(this ClaimsPrincipal principal, string objectId)
        {
            var userData = principal.GetUserData();
            //var functionCode = 0;
            int[] arrayfunctionCode;

            if (String.IsNullOrWhiteSpace(objectId)) { return null; }
            if (userData.Permissions.TryGetValue(objectId, out arrayfunctionCode))
            {
                if (arrayfunctionCode.Length > 0)
                {


                    return arrayfunctionCode;

                }
                else
                {
                    return null;

                }

            }
            return null;
        }

        public static bool HasPermission(this ClaimsPrincipal principal, string objectId, int functionCode = 1)
        {

            if (String.IsNullOrWhiteSpace(objectId)) { return true; }
            var userData = GetUserData(principal);
            var f = 0;
            var values = objectId.Split(',');
            var result = false;
            int[] arrayfunctionCode;
            foreach (var value in values)
            {
                if (userData.Permissions.TryGetValue(value, out arrayfunctionCode))
                {
                    if (arrayfunctionCode.Length > 0)
                    {

                        for (int index = 0; index < arrayfunctionCode.Length; index++)
                        {
                            if (result != true)
                            {
                                result |= (arrayfunctionCode[index] & functionCode) > 0;
                            }
                            continue;
                        }

                    }

                }
            }
            return result;
        }

    }
}
