
using System;
using System.Collections.Generic;
using System.Text;

namespace WEB.APP.MvcWebApp.Navigation
{
  
    public class Module
    {
        public string ModuleCode { get; set; }
        public string ModuleName { get; set; }
        public int Seq { get; set; }
        public string IconClass { get; set; }
    }

    public class Screen
    {
        public string ScreenId { get; set; }
        public string Name { get; set; }
        public int FunctionCode { get; set; }
        public string ModuleCode { get; set; }
        public string IconClass { get; set; }
        public string SupportDeviceType { get; set; }
        public bool MainMenuFlag { get; set; }
        public bool PermissionFlag { get; set; }
        public string ChildScreen { get; set; }
        public int Seq { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; }
    }


}
