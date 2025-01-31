
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;


namespace WEB.APP
{
    [AttributeUsage(AttributeTargets.Method)]
    public class PurgeTempUplodAttribute : ActionFilterAttribute
    {
        public PurgeTempUplodAttribute()
        {
            
        }

        public PurgeTempUplodAttribute(string ruleName)
        {
            this.RuleName = ruleName;
        }

        /// <summary>
        /// Get or set rule name of upload file options.
        /// </summary>
        public string RuleName { get; private set; }

        /// <summary>
        /// Get or set expiration to purge in minutes.
        /// </summary>
        public int Expiration { get; set; } = 180;

    }
}
