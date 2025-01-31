using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using WEB.APP.MvcWebApp.Navigation;


namespace WEB.APP
{
    public class SiteMapTitleAttribute : ActionFilterAttribute
    {
        public string ObjectId { get; set; }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.Controller as Controller;
            if (controller == null) { return; }

            var _provider = context.HttpContext.RequestServices.GetService<ISiteMapProvider>();
            var siteMapNode = _provider.FindSiteMap(this.ObjectId);
            controller.ViewBag.ObjectId = this.ObjectId;
            controller.ViewBag.PageTitle = siteMapNode == null ? ObjectId : siteMapNode.Title;
            controller.ViewBag.PageIcon = siteMapNode?.IconClass;
        }
    }
}
