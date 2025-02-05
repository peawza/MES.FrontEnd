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

        [SiteMapTitle(ObjectId = "PMS010")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms020", Name = "PMS010")]
        public IActionResult pms010_Inquiry()
        {
            return View();
        }

        [SiteMapTitle(ObjectId = "PMS020")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms020", Name = "PMS020")]
        public IActionResult pms020_Inquiry()
        {
            return View();
        }


        [SiteMapTitle(ObjectId = "PMS030")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms030", Name = "PMS030")]
        public IActionResult pms030_Inquiry()
        {
            return View();
        }

        [SiteMapTitle(ObjectId = "PMS040")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms040", Name = "PMS040")]
        public IActionResult pms040_Inquiry()
        {
            return View();
        }


        [SiteMapTitle(ObjectId = "PMS050")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms050", Name = "PMS050")]
        public IActionResult pms050_Inquiry()
        {
            return View();
        }

        [SiteMapTitle(ObjectId = "PMS060")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms060", Name = "PMS060")]
        public IActionResult pms060_Inquiry()
        {
            return View();
        }

        [SiteMapTitle(ObjectId = "PMS070")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms070", Name = "PMS070")]
        public IActionResult pms070_Inquiry()
        {
            return View();
        }




        [SiteMapTitle(ObjectId = "PMS080")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms080", Name = "PMS080")]
        public IActionResult pms080_Inquiry()
        {
            return View();
        }

        [SiteMapTitle(ObjectId = "PMS100")]
        //[ApplicationAuthorize("S003")]
        [Route("~/production/master/pms080", Name = "PMS100")]
        public IActionResult pms100_Inquiry()
        {
            return View();
        }
    }
}