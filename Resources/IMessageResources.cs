using Microsoft.Extensions.Localization;

namespace WEB.APP.Localization
{
    public interface IMessageResources
    {
        LocalizedString this[string ScreenCode, string ObjectID] { get; }
        LocalizedString this[string ScreenCode, string ObjectID, params object[] arguments] { get; }
        IEnumerable<LocalizedResources_model> GetAllStrings(bool includeAncestorCultures);
        IEnumerable<LocalizedResources> GetAllStrings_All_Languages(bool includeAncestorCultures);




    }
}
