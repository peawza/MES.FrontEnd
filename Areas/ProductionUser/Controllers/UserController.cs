using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WEB.APP.Controllers;

namespace WEB.APP.Areas.Production.Controllers
{
    //[Authorize]
    [AllowAnonymous]
    [Area("ProductionUser")]
    public class ProductionUserController : AppControllerBase
    {
        private readonly ILogger<ProductionUserController>? _logger;
        //private readonly IStringLocalizer _localizer;
        //private readonly IMemoryCache _cache;

        public ProductionUserController(ILogger<ProductionUserController> logger)
        {
            _logger = logger;

        }

        [SiteMapTitle(ObjectId = "P003")]
        //[ApplicationAuthorize("S003")]
        [AllowAnonymous]
        [Route("~/Production/UserManages", Name = "P003")]
        public IActionResult Inquiry()
        {
            return View();
        }


    }
}