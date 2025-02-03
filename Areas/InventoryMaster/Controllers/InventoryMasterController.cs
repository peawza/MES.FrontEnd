using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WEB.APP.Controllers;

namespace WEB.APP.Areas.Production.Controllers
{
    //[Authorize]
    [AllowAnonymous]
    [Area("InventoryMaster")]
    public class InventoryMasterController : AppControllerBase
    {
        private readonly ILogger<InventoryMasterController>? _logger;
        //private readonly IStringLocalizer _localizer;
        //private readonly IMemoryCache _cache;

        public InventoryMasterController(ILogger<InventoryMasterController> logger)
        {
            _logger = logger;

        }

        [SiteMapTitle(ObjectId = "I001")]
        //[ApplicationAuthorize("S003")]
        [AllowAnonymous]
        [Route("~/inventory/master", Name = "I001")]
        public IActionResult Inquiry()
        {
            return View();
        }


    }
}