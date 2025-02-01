using Microsoft.Extensions.Localization;

namespace WEB.APP.Localization
{
    public interface IMessageLocalizer
    {
        LocalizedString this[string name] { get; }
        LocalizedString this[string name, params object[] arguments] { get; }
        IEnumerable<LocalizedString> GetAllStrings(bool includeAncestorCultures);

        IEnumerable<ResourceMessage> GetAllStrings_All_Languages(bool includeAncestorCultures);
    }
}
