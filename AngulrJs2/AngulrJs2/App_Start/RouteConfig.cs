﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AngulrJs2
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
         
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //routes.IgnoreRoute("welcome");
            //routes.IgnoreRoute("");
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }

            
            );
          //  routes.MapSpaFallbackRoute("spa-fallback", new { controller = "Home", action = "Index" });
        }
    }
}