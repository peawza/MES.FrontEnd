using System.Reflection;

namespace WEB.APP.Extensions
{
    public static class AssemblyHelper
    {
        public static string FormatVersion(Version assemblyVersion)
        {
            if (assemblyVersion.Build == 0)
            {
                return (assemblyVersion.Major + "." + assemblyVersion.Minor);
            }
            return string.Concat(new object[] { assemblyVersion.Major, ".", assemblyVersion.Minor, ".", assemblyVersion.Build });
        }

        public static Type[] GetClassWithAssignableFromBaseType(Assembly assembly, Type baseType)
        {
            List<Type> list = new List<Type>();
            foreach (Type type in assembly.GetTypes())
            {
                if ((baseType.IsAssignableFrom(type) && type.IsClass) && !type.IsAbstract)
                {
                    list.Add(type);
                }
            }
            return list.ToArray();
        }

        public static Type[] GetTypeFromAttribute<TAttr>(Assembly assembly, bool inherit) where TAttr : Attribute
        {
            List<Type> list = new List<Type>();
            foreach (Type type in assembly.GetTypes())
            {
                if (type.IsDefined(typeof(TAttr), inherit))
                {
                    list.Add(type);
                }
            }
            return list.ToArray();
        }

        public static string GetProduct(Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyProductAttribute>();
            return attr == null ? null : attr.Product;
        }

        public static string GetDescription(Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyDescriptionAttribute>();
            if (attr == null) { return null; }
            return attr.Description;
        }

        public static string GetCopyright(Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyCopyrightAttribute>();
            if (attr == null) { return null; }
            return attr.Copyright;
        }

        public static string GetCompany(Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyCompanyAttribute>();
            if (attr == null) { return null; }
            return attr.Company;
        }

        public static Version GetVersion(Assembly assembly)
        {
            return assembly.GetName().Version;
        }

        public static string GetFileVersion(Assembly assembly)
        {
            var attr = assembly.GetCustomAttribute<AssemblyFileVersionAttribute>();
            if (attr == null) { return null; }
            return attr.Version;
        }

        public static DateTime LastWriteTime(Assembly assembly)
        {
            return File.GetLastWriteTime(assembly.Location);
        }
    }
}
