using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using System.Globalization;
using System.Text.Json;

namespace WEB.APP.Localization
{
    public class DbMessageResources : IMessageResources
    {
        private readonly TimeSpan _timeToLive = TimeSpan.FromSeconds(30);
        private readonly IMemoryCache _memoryCache;
        private readonly IHttpClientFactory _httpClientFactory;
        private static bool _isLoaded = false;
        private static List<LocalizedResources> _resourceResources = new();
        public DbMessageResources(IHttpClientFactory httpClientFactory, IMemoryCache memoryCache)
            : this(memoryCache, TimeSpan.FromSeconds(300), httpClientFactory)
        {
        }

        public DbMessageResources(IMemoryCache memoryCache, TimeSpan timeToLive, IHttpClientFactory httpClientFactory)
        {
            ///_dbContext = dbContext;
            _timeToLive = timeToLive;
            _memoryCache = memoryCache;
            _httpClientFactory = httpClientFactory;
        }



        public LocalizedString this[string ScreenCode, string ObjectID]
        {
            get
            {
                string name = ScreenCode + "_" + ObjectID;
                var value = GetString(ScreenCode, ObjectID);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public LocalizedString this[string ScreenCode, string ObjectID, params object[] arguments]
        {
            get
            {
                string name = ScreenCode + "_" + ObjectID;
                var format = GetString(ScreenCode, ObjectID);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        public async Task LoadResourceMessagesAsync()
        {
            if (_isLoaded) return;

            using var client = _httpClientFactory.CreateClient();
            HttpResponseMessage response = await client.GetAsync("http://localhost:5001/api/v1/auth/Resources/getresources");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                //var apiResult = JsonSerializer.Deserialize<ApiResult<List<LocalizedResources>>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                //if (apiResult?.Data != null)
                //{
                //    _resourceResources = apiResult.Data;
                //    _isLoaded = true;
                //}

                var apiResult = JsonSerializer.Deserialize<List<LocalizedResources>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (apiResult != null)
                {
                    _resourceResources = apiResult;
                    _isLoaded = true;
                }
            }
        }



        private IEnumerable<LocalizedResources> LocalizedResources
        {
            get
            {
                return _resourceResources;
            }
        }


        public IEnumerable<LocalizedResources_model> GetAllStrings(bool includeAncestorCultures)
        {
            var culture = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;

            return LocalizedResources.Select(r =>
                new LocalizedResources_model
                {
                    ScreenCode = r.ScreenCode,
                    ObjectID = r.ObjectID,
                    MessageName = culture == "th" ? r.ResourcesTH ?? r.ScreenCode + "_" + r.ObjectID : r.ResourcesEN ?? r.ScreenCode + "_" + r.ObjectID,
                    //IncludeAncestorCultures = includeAncestorCultures
                });
        }

        public IEnumerable<LocalizedResources> GetAllStrings_All_Languages(bool includeAncestorCultures)
        {
            // var culture = str_culture;

            return LocalizedResources.Select(r =>
                new LocalizedResources
                {
                    ScreenCode = r.ScreenCode,
                    ObjectID = r.ObjectID,
                    ResourcesTH = r.ResourcesTH ?? r.ScreenCode + "_" + r.ObjectID,
                    ResourcesEN = r.ResourcesEN ?? r.ScreenCode + "_" + r.ObjectID,
                    //IncludeAncestorCultures = includeAncestorCultures
                });
        }




        private string GetString(string ScreenCode, string ObjectID)
        {
            //var culture = str_culture;
            var culture = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
            string resultString = string.Empty;
            if (culture == "th")
            {
                resultString = LocalizedResources.FirstOrDefault(r => r.ScreenCode == ScreenCode && r.ObjectID == ObjectID)?.ResourcesTH;
            }
            else
            {
                resultString = LocalizedResources.FirstOrDefault(r => r.ScreenCode == ScreenCode && r.ObjectID == ObjectID)?.ResourcesEN;
            }

            return resultString;
        }

    }
}
