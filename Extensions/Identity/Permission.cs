using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WEB.APP.Extensions.Identity
{
    public partial class GetGroupPermission_View
    {
        public string ScreenID { get; set; }
        public int FunctionCode { get; set; }
    }
    public partial class Permission
    {
        public Guid Id { get; set; }
        public int GroupId { get; set; }
        public string ScreenId { get; set; }
        public int FunctionCode { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; }
        public DateTime UpdateDate { get; set; }
        public string UpdateBy { get; set; }
    }

    public partial class PermissionDataView
    {
        public string ModuleCode { get; set; }
        public string ModuleName { get; set; }
        public int Seq { get; set; }
        public string ScreenId { get; set; }
        public string ScreenName { get; set; }
        public int ScreenFunctionCode { get; set; }
        public int PermissionFunctionCode { get; set; }
    }
}
