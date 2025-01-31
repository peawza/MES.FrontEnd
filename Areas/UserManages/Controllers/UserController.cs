using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using WEB.APP.Models;

namespace WEB.APP.Controllers
{
    //[Authorize]
    [AllowAnonymous]
    [Area("UserManages")]
    public class UserController : AppControllerBase
    {
        private readonly ILogger<UserController> _logger;
        //private readonly IStringLocalizer _localizer;
        //private readonly IMemoryCache _cache;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            //_localizer = localizer;
            //_cache = cache;
            
        }

        [SiteMapTitle(ObjectId = "S003")]
        //[ApplicationAuthorize("S003")]
        [AllowAnonymous]
        [Route("~/UserManages", Name = "S003")]
        public IActionResult Inquiry()
        {
            return View();
        }

        
    }
}