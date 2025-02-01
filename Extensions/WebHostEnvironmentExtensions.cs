namespace WEB.APP.Extensions
{
    /// <summary>
    /// 
    /// </summary>
    public static class WebHostEnvironmentExtensions
    {
        /// <summary>
        /// Get content path.
        /// </summary>
        /// <param name="hostingEnvironment"></param>
        /// <param name="relativePath"></param>
        /// <returns></returns>
        public static string GetContentPath(this IWebHostEnvironment hostingEnvironment, string relativePath)
        {
            if (Path.IsPathFullyQualified(relativePath))
            {
                return relativePath;
            }

            var rootPrefixes = new string[] { "~/", "/" };
            foreach (var rootPrefix in rootPrefixes)
            {
                // ~/shared/temp/ ==> {root}/shared/temp
                // /shared/temp/ ==> {root}/shared/temp
                if (relativePath.StartsWith(rootPrefix))
                {
                    return Path.Combine(hostingEnvironment.ContentRootPath, relativePath.Replace(rootPrefix, "").Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar));
                }
            }
            // shared/temp/ ==> {root}/shared/temp
            return Path.Combine(hostingEnvironment.ContentRootPath, relativePath);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="hostingEnvironment"></param>
        /// <param name="sid"></param>
        /// <returns></returns>
        public static string GetSharedTemporaryUploadDirectory(this IWebHostEnvironment hostingEnvironment, string sid)
        {
            if (sid == null) { throw new ArgumentNullException("sid"); }
            return Path.Combine(hostingEnvironment.ContentRootPath, "shared", "temp-upload", sid);
        }



    }
}
