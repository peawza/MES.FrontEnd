using static WEB.APP.ApplicationAuthorizeAttribute;

namespace WEB.APP.Extensions.Permission
{
    public class PermissionNames
    {
        public static readonly NameCodeItem View = new NameCodeItem { Name = "View", FunctionCode = 1 };
        public static readonly NameCodeItem New = new NameCodeItem { Name = "New", FunctionCode = 2 };
        public static readonly NameCodeItem Edit = new NameCodeItem { Name = "Edit", FunctionCode = 4 };
        public static readonly NameCodeItem Delete = new NameCodeItem { Name = "Delete", FunctionCode = 8 };
        public static readonly NameCodeItem Export = new NameCodeItem { Name = "Export", FunctionCode = 16 };
        public static readonly NameCodeItem Print = new NameCodeItem { Name = "Print", FunctionCode = 32 };
        public static readonly NameCodeItem RepairResult = new NameCodeItem { Name = "Repair Result", FunctionCode = 64 };
        public static readonly NameCodeItem Special = new NameCodeItem { Name = "Special", FunctionCode = 128 };
        public static readonly NameCodeItem CancelLost = new NameCodeItem { Name = "Cancel Lost", FunctionCode = 256 };
        public static readonly NameCodeItem Import = new NameCodeItem { Name = "Import", FunctionCode = 512 };

        public static Dictionary<string, int> ToDictionary()
        {
            return new Dictionary<string, int>
            {
                { View.Name, View.FunctionCode },
                { New.Name, New.FunctionCode },
                { Edit.Name, Edit.FunctionCode },
                { Delete.Name, Delete.FunctionCode },
                { Export.Name, Export.FunctionCode },
                { Print.Name, Print.FunctionCode },
                { RepairResult.Name, RepairResult.FunctionCode },
                { Special.Name, Special.FunctionCode },
                { CancelLost.Name, CancelLost.FunctionCode },
                { Import.Name, Import.FunctionCode },
            };
        }
    }
}