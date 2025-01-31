using System;
using System.Collections.Generic;

#nullable disable

namespace WEB.APP.Extensions.Identity
{
    public partial class UserDataPermissionHeader
    {
        public UserDataPermissionHeader()
        {
            UserDataPermissionDetails = new HashSet<UserDataPermissionDetail>();
        }

        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string RoleCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDateTime { get; set; }
        public string CreateBy { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string UpdateBy { get; set; }

        public virtual ICollection<UserDataPermissionDetail> UserDataPermissionDetails { get; set; }
    }
}
