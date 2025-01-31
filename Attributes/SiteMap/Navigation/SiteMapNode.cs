using System;
using System.Collections.Generic;
using System.Text;

namespace WEB.APP.MvcWebApp.Navigation
{
    public class SiteMapNode
    {
        public string ObjectId { get; set; }
        public string Title { get; set; }
        public string RouteName { get; set; }
        public string IconClass { get; set; } 
        public string ModuleCode { get; set; }
        public Dictionary<string, object> Attributes { get; set; } = new Dictionary<string, object>();
        public IList<SiteMapNode> ChildNodes { get; set; } = new List<SiteMapNode>();

    }
}
