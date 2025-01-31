using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WEB.APP.Extensions.Identity
{
    public class DataAccessControlSearchCriteria
    {
        public string UserGroup { get; set; }
        public string UserName { get; set; }
        public string Scope { get; set; }
        public string Role { get; set; }
    }

    public class UserDataPermissionHeaderDataView
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string CategoryDisplayName { get; set; }
        public string RoleCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDateTime { get; set; }
        public string CreateBy { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string UpdateBy { get; set; }

        public string CreateDisplayName { get; set; }
        public string UpdateDisplayName { get; set; }
    }

    public class UserDataPermissionDetailDataView
    {
        public Guid Id { get; set; }
        public int HeaderId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public bool IsEmailAlert { get; set; }
        public DateTime CreateDateTime { get; set; }
        public string CreateBy { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string UpdateBy { get; set; }

        public string CreateDisplayName { get; set; }
        public string UpdateDisplayName { get; set; }
        [NotMapped]
        public string[] UserGroupNames { get; set; }
    }
}
