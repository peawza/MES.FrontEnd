using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using System.Globalization;
using System.Text.Json;

namespace WEB.APP.Localization
{
    public class DbMessageLocalizer : IMessageLocalizer
    {
        private readonly TimeSpan _timeToLive = TimeSpan.FromSeconds(30);
        private readonly IMemoryCache _memoryCache;
        private readonly IHttpClientFactory _httpClientFactory;
        private static bool _isLoaded = false;
        private static List<ResourceMessage> _resourceMessages = new();
        public DbMessageLocalizer(IHttpClientFactory httpClientFactory, IMemoryCache memoryCache)
            : this(memoryCache, TimeSpan.FromSeconds(300), httpClientFactory)
        {
        }

        public DbMessageLocalizer(IMemoryCache memoryCache, TimeSpan timeToLive, IHttpClientFactory httpClientFactory)
        {
            ///_dbContext = dbContext;
            _timeToLive = timeToLive;
            _memoryCache = memoryCache;
            _httpClientFactory = httpClientFactory;
        }

        public LocalizedString this[string name]
        {
            get
            {
                var value = GetString(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public async Task LoadResourceMessagesAsync()
        {
            if (_isLoaded) return;

            using var client = _httpClientFactory.CreateClient();
            HttpResponseMessage response = await client.GetAsync("http://localhost:5001/api/v1/auth/Resources/getmessages");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                //var apiResult = JsonSerializer.Deserialize<ApiResult<List<ResourceMessage>>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                var apiResult = JsonSerializer.Deserialize<List<ResourceMessage>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (apiResult != null)
                {
                    _resourceMessages = apiResult;
                    _isLoaded = true;
                }
            }
        }
        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }



        private IEnumerable<ResourceMessage> LocalizedMessages
        {
            get
            {
                return _resourceMessages;
            }
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeAncestorCultures)
        {
            var culture = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
            return LocalizedMessages.Select(r => new LocalizedString(r.MessageCode, culture == "th" ? r.MessageNameTH ?? r.MessageCode : r.MessageNameEN ?? r.MessageCode, true));
        }

        private string GetString(string name)
        {
            var culture = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName;
            string resultString = string.Empty;
            if (culture == "th")
            {
                resultString = LocalizedMessages.FirstOrDefault(r => r.MessageCode == name)?.MessageNameTH;
            }
            else
            {
                resultString = LocalizedMessages.FirstOrDefault(r => r.MessageCode == name)?.MessageNameEN;
            }

            return resultString;
        }
        public IEnumerable<ResourceMessage> GetAllStrings_All_Languages(bool includeAncestorCultures)
        {
            return LocalizedMessages.Select(r =>
                new ResourceMessage
                {
                    MessageCode = r.MessageCode,
                    MessageType = r.MessageType,
                    MessageNameTH = r.MessageNameTH ?? r.MessageCode + "_" + r.MessageType,
                    MessageNameEN = r.MessageNameEN ?? r.MessageCode + "_" + r.MessageType
                });
        }


    }
}
