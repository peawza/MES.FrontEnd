using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Reflection;
using System.Text.Json;
using WEB.APP.Helpers;

namespace WEB.APP.Controllers
{
    public abstract class AppControllerBase : Controller
    {
        protected IActionResult Ok(string message)
        {
            return Ok(new { message });
        }
        public class ServerOperationTypes
        {
            public const string Read = "read";
            public const string Update = "update";
            public const string Create = "create";
            public const string Destroy = "destroy";
        }

        protected IActionResult InternalServerError(Exception ex, string operation = ServerOperationTypes.Read)
        {
            var message = ExceptionHelper.GetLastExceptionMessage(ex);
            var invaidError = ex as InvalidDataObjectException;
            if (invaidError == null)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message, operation });
            }
            return StatusCode((int)HttpStatusCode.InternalServerError, new { message, operation, errors = invaidError.ValidationMessages });
        }

        protected IActionResult InternalServerError(string message, string operation = ServerOperationTypes.Read)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, new { message, operation });
        }

        protected IActionResult InternalServerError(object data)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, data);
        }

        protected IActionResult JsonWithCamelNaming(object data)
        {
            var contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            return Json(data, new JsonSerializerSettings() { ContractResolver = contractResolver, Formatting = Formatting.Indented, ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        protected IActionResult JsonWithDefaultOptions(object data, JsonSerializerDefaults options = JsonSerializerDefaults.General)
        {
            //return Json(data, new JsonSerializerOptions(options));
            return Json(data, new JsonSerializerSettings() { Formatting = Formatting.Indented, ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        protected Dictionary<string, string> GetMappingLocalize<T>(IStringLocalizer localizer)
        {
            var mappings = new Dictionary<string, string>();
            foreach (var p in typeof(T).GetProperties())
            {
                var attr = p.GetCustomAttribute<DisplayAttribute>(true);
                mappings.Add(p.Name, localizer[attr == null ? p.Name : attr.Name].Value);
            }
            return mappings;
        }

        protected string JsonSerializeObject<T>(T data)
        {
            return JsonSerializeObject(data, Formatting.None);
        }

        protected string JsonSerializeObject<T>(T data, Formatting formatting)
        {
            return JsonConvert.SerializeObject(data, new JsonSerializerSettings()
            {
                Formatting = formatting,
                NullValueHandling = NullValueHandling.Ignore,
                DefaultValueHandling = DefaultValueHandling.Include,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
        }
    }
}
