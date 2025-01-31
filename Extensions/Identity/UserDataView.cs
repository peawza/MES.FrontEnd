using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace WEB.APP.Extensions.Identity
{
    public partial class User
    {
        public UserDataView ToDataView(params UserRole[] userRoles)
        {
            var roles = (userRoles ?? new UserRole[] { }).Where(t => t.UserId == Id);
            return new UserDataView()
            {
                Id = Id,
                UserName = UserName,
                DepartmentNo = DepartmentNo,
                FirstName = FirstName,
                LastName = LastName,
                PositionNo = PositionNo,
                Email = Email,
                CreateBy = CreateBy,
                CreateDate = CreateDate,
                UpdateBy = UpdateBy,
                UpdateDate = UpdateDate,
                IsActive = IsActive,
                LastChangedPassword = LastChangedPassword,
                LastSignedIn = LastSignedIn,
                Roles = roles.Select(t => t.Role?.Name).ToArray()
            };
        }
    }

    public class UserDataView
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public int DepartmentNo { get; set; }
        public int PositionNo { get; set; }

        public string Email { get; set; }

        [NotMapped]
        public string[] Roles { get; set; }
        public bool IsActive { get; set; }

        public DateTime? LastChangedPassword { get; set; }
        public DateTime? LastSignedIn { get; set; }
        public string CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public string UpdateBy { get; set; }
        public DateTime UpdateDate { get; set; }

        public string DepartmentName { get; set; }
        public string PositionName { get; set; }
    }
    [Flags]
    public enum ActiveStatus : int
    {
        Active = 1,
        Inactive = 2,
        All = Active | Inactive
    }
    public class UserSearchCriteria
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string Department { get; set; }
        public int? RoleId { get; set; }
        public ActiveStatus Status { get; set; } = ActiveStatus.Active;
    }

    public class RoleSearchCriteria
    {
        public string Name { get; set; }
        public string UserName { get; set; }
        public ActiveStatus Status { get; set; } = ActiveStatus.Active;
    }

    public class UserRoleMapping
    {
        public int RoleId { get; set; }
        public int[] Users { get; set; }
        public string User { get; set; }
    }

    public partial class UserRole
    {
        [NotMapped]
        public bool IsExists { get; set; }
    }
}
