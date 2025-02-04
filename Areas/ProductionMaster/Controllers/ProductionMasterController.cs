using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WEB.APP.Controllers;

namespace WEB.APP.Areas.Production.Controllers
{
    //[Authorize]
    [AllowAnonymous]
    [Area("ProductionMaster")]
    public class ProductionMasterController : AppControllerBase
    {
        private readonly ILogger<ProductionMasterController>? _logger;

        public ProductionMasterController(ILogger<ProductionMasterController> logger)
        {
            _logger = logger;

        }

        [SiteMapTitle(ObjectId = "PMS020")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms020", Name = "PMS020")]
        public IActionResult pms020_Inquiry()
        {
            return View();
        }


    }
}