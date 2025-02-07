using Microsoft.Extensions.Caching.Memory;

namespace WEB.APP.MvcWebApp.Navigation
{
    public interface ISiteMapProvider
    {
        IList<SiteMapNode> GetSiteMaps();
        IList<SiteMapNode> GetSiteMapsAll();
        SiteMapNode FindSiteMap(string key);
    }

    public class DbSiteMapProvider : ISiteMapProvider
    {
        //private readonly SiteMapDbContext _dbContext;
        private readonly IMemoryCache _cache;

        public DbSiteMapProvider(IMemoryCache cache)
        {
            //_dbContext = dbContext;
            _cache = cache;
        }

        private IList<SiteMapNode> EnsureLoadDataFromStore()
        {
            var siteMapNodes = _cache.GetOrCreate("$SiteMap", (entry) =>
            {
                entry.SetSlidingExpiration(TimeSpan.FromSeconds(60));

                List<Module> modules_List = new List<Module>
                {
                    new Module { ModuleCode = "MOD01", ModuleName = "Dashboard", Seq = 1, IconClass = "icon-dashboard" },
                    new Module { ModuleCode = "MOD02", ModuleName = "Reports", Seq = 2, IconClass = "icon-reports" },
                    new Module { ModuleCode = "MOD03", ModuleName = "Settings", Seq = 3, IconClass = "icon-settings" }
                };
                var screens_List = new List<Screen>
                {
                    new Screen { ScreenId = "S001", Name = "Dashboard", ModuleCode = "MOD01", IconClass = "icon-dashboard", Seq = 1, SupportDeviceType = "WEB", ChildScreen = "None", MainMenuFlag = true, PermissionFlag = true },
                    new Screen { ScreenId = "S002", Name = "Reports", ModuleCode = "MOD02", IconClass = "icon-reports", Seq = 2, SupportDeviceType = "WEB", ChildScreen = "None", MainMenuFlag = true, PermissionFlag = true },
                    new Screen { ScreenId = "S003", Name = "Settings", ModuleCode = "MOD03", IconClass = "icon-settings", Seq = 3, SupportDeviceType = "MOBILE", ChildScreen = "None", MainMenuFlag = false, PermissionFlag = true },
                    new Screen { ScreenId = "PMS020", Name = "Machine Stop Reason Master", ModuleCode = "MOD03", IconClass = "icon-settings", Seq = 3, SupportDeviceType = "WEB", ChildScreen = "None", MainMenuFlag = false, PermissionFlag = true }
                    
                //PMS020
                };

                var screens = modules_List.Join(
                            screens_List.Where(s => s.SupportDeviceType == "WEB"),
                            module => module.ModuleCode,
                            screen => screen.ModuleCode,
                            (module, screen) => new ScreenDataView
                            {
                                ModuleCode = module.ModuleCode,
                                ModuleName = module.ModuleName,
                                ModuleIconClass = module.IconClass,
                                Seq = module.Seq,
                                ScreenId = screen.ScreenId,
                                Name = screen.Name,
                                IconClass = screen.IconClass,
                                ScreenSeq = screen.Seq,
                                ChildScreen = screen.ChildScreen,
                                MainMenuFlag = screen.MainMenuFlag,
                                PermissionFlag = screen.PermissionFlag
                            })
                            .OrderBy(t => t.Seq).ThenBy(t => t.ScreenSeq).ThenBy(t => t.ScreenId).ToList();

                var modules = screens.Select(t => t.ModuleCode).Distinct();
                var nodes = new List<SiteMapNode>();
                foreach (var module in modules)
                {
                    var childScreens = screens.Where(t => t.ModuleCode == module);
                    var m = childScreens.First();
                    var parent = new SiteMapNode() { ObjectId = module, ModuleCode = module, Title = m.ModuleName, RouteName = module, IconClass = m.ModuleIconClass, Attributes = new Dictionary<string, object> { { "main-menu", true }, { "permission-enabled", true }, { "child-screens", childScreens.Select(t => t.ScreenId).ToArray() } } };
                    CreateSitMapNode(parent, screens);
                    nodes.Add(parent);
                }
                return nodes;
            });
            return siteMapNodes;
        }

        public IList<SiteMapNode> GetSiteMaps()
        {
            return EnsureLoadDataFromStore();
        }


        public IList<SiteMapNode> GetSiteMapsAll()
        {
            var siteMapNodes = _cache.GetOrCreate("$SiteMapAll", (entry) =>
            {
                entry.SetSlidingExpiration(TimeSpan.FromSeconds(60));
                List<Module> modules_List = new List<Module>
                {
                    new Module { ModuleCode = "MOD01", ModuleName = "Dashboard", Seq = 1, IconClass = "icon-dashboard" },
                    new Module { ModuleCode = "MOD02", ModuleName = "Reports", Seq = 2, IconClass = "icon-reports" },
                    new Module { ModuleCode = "MOD03", ModuleName = "Settings", Seq = 3, IconClass = "icon-settings" }
                };
                var screens_List = new List<Screen>
                {
                    new Screen { ScreenId = "S001", Name = "Dashboard", ModuleCode = "MOD01", IconClass = "icon-dashboard", Seq = 1, SupportDeviceType = "WEB", ChildScreen = "None", MainMenuFlag = true, PermissionFlag = true },
                    new Screen { ScreenId = "S002", Name = "Reports", ModuleCode = "MOD02", IconClass = "icon-reports", Seq = 2, SupportDeviceType = "WEB", ChildScreen = "None", MainMenuFlag = true, PermissionFlag = true },
                    new Screen { ScreenId = "S003", Name = "Settings", ModuleCode = "MOD03", IconClass = "icon-settings", Seq = 3, SupportDeviceType = "MOBILE", ChildScreen = "Preferences", MainMenuFlag = false, PermissionFlag = true },
                    new Screen { ScreenId = "PMS020", Name = "Machine Stop Reason Master", ModuleCode = "MOD03", IconClass = "icon-settings", Seq = 3, SupportDeviceType = "WEB", ChildScreen = "None", MainMenuFlag = false, PermissionFlag = true }
                };
                var screens = modules_List.Join(
                            screens_List.Where(s => s.SupportDeviceType == "WEB"),
                            module => module.ModuleCode,
                            screen => screen.ModuleCode,
                            (module, screen) => new ScreenDataView
                            {
                                ModuleCode = module.ModuleCode,
                                ModuleName = module.ModuleName,
                                ModuleIconClass = module.IconClass,
                                Seq = module.Seq,
                                ScreenId = screen.ScreenId,
                                Name = screen.Name,
                                IconClass = screen.IconClass,
                                ScreenSeq = screen.Seq,
                                ChildScreen = screen.ChildScreen,
                                MainMenuFlag = screen.MainMenuFlag,
                                PermissionFlag = screen.PermissionFlag
                            })
                            .OrderBy(t => t.Seq).ThenBy(t => t.ScreenSeq).ThenBy(t => t.ScreenId).ToList();

                var modules = screens.Select(t => t.ModuleCode).Distinct();
                var nodes = new List<SiteMapNode>();
                foreach (var module in modules)
                {
                    var childScreens = screens.Where(t => t.ModuleCode == module);
                    var m = childScreens.First();
                    var parent = new SiteMapNode() { ObjectId = module, ModuleCode = module, Title = m.ModuleName, RouteName = module, IconClass = m.ModuleIconClass, Attributes = new Dictionary<string, object> { { "main-menu", true }, { "permission-enabled", true }, { "child-screens", childScreens.Select(t => t.ScreenId).ToArray() } } };
                    CreateSitMapNode(parent, screens);
                    nodes.Add(parent);
                }
                return nodes;
            });

            return siteMapNodes;

        }

        private void CreateSitMapNode(SiteMapNode parent, IEnumerable<ScreenDataView> screens)
        {
            var ms = screens.Where(t => t.ModuleCode == parent.ModuleCode).OrderBy(t => t.ScreenSeq).ThenBy(t => t.ScreenId);
            foreach (var s in ms)
            {
                parent.ChildNodes.Add(s.ToSiteMapNode());
            }
        }

        public SiteMapNode FindSiteMap(string key)
        {
            var siteMapNodes = EnsureLoadDataFromStore();
            var findSiteMapNode = siteMapNodes.FirstOrDefault(t => t.ObjectId == key);
            if (findSiteMapNode == null)
            {
                foreach (var siteMapNode in siteMapNodes)
                {
                    FindSiteMapRecursive(siteMapNode, key, out findSiteMapNode);
                    if (findSiteMapNode != null) { break; }
                }
            }
            return findSiteMapNode;
        }

        private void FindSiteMapRecursive(SiteMapNode parent, string key, out SiteMapNode result)
        {
            result = parent.ChildNodes.FirstOrDefault(t => t.ObjectId == key);
            if (result == null)
            {
                foreach (var child in parent.ChildNodes)
                {
                    FindSiteMapRecursive(child, key, out result);
                    if (result != null) { break; }
                }
            }
        }

    }

    public class ScreenDataView
    {
        public string ModuleCode { get; set; }
        public string ModuleName { get; set; }
        public string ModuleIconClass { get; set; }
        public int Seq { get; set; }
        public string ScreenId { get; set; }
        public string Name { get; set; }
        public string IconClass { get; set; }
        public int ScreenSeq { get; set; }
        public string ChildScreen { get; set; }
        public bool MainMenuFlag { get; set; }
        public bool PermissionFlag { get; set; }

        public SiteMapNode ToSiteMapNode()
        {
            var node = new SiteMapNode()
            {
                IconClass = this.IconClass,
                ModuleCode = this.ModuleCode,
                ObjectId = this.ScreenId,
                RouteName = this.ScreenId,
                Title = this.Name
            };
            if (this.MainMenuFlag) { node.Attributes.Add("main-menu", true); }
            if (this.PermissionFlag) { node.Attributes.Add("permission-enabled", true); }
            if (!String.IsNullOrWhiteSpace(this.ChildScreen))
            {
                node.Attributes.Add("child-screens", this.ChildScreen.Split(','));
            }
            return node;
        }
    }

    [Flags]
    public enum ScreenAttributes : int
    {
        None = 0,
        MainMenu = 1,
        Permission = 2,
        All = MainMenu | Permission
    }
}
