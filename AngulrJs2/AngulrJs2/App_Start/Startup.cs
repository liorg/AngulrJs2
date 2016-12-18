using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Elal.FlightPostponed.MobileWeb.Startup))]

namespace Elal.FlightPostponed.MobileWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
           // ConfigureAuth(app);
        }
    }
}
