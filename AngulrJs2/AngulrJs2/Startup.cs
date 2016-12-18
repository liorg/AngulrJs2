//using System;
//using System.Collections.Generic;
//using System.Linq;
//using Microsoft.Owin;
//using Owin;

//[assembly: OwinStartup(typeof(Elal.FlightPostponed.MobileWeb.Startup))]

//namespace Elal.FlightPostponed.MobileWeb
//{
//    public partial class Startup
//    {
//        public void Configuration(IAppBuilder app)
//        {
//            app.MapSignalR();
//            ConfigureAuth(app);
//        }
//        public void ConfigureAuth(IAppBuilder app)
//        {
          

//            // Uncomment the following lines to enable logging in with third party login providers
//            //app.UseMicrosoftAccountAuthentication(
//            //    clientId: "",
//            //    clientSecret: "");

//            //app.UseTwitterAuthentication(
//            //    consumerKey: "",
//            //    consumerSecret: "");

//            //app.UseFacebookAuthentication(
//            //    appId: "",
//            //    appSecret: "");

//            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
//            //{
//            //    ClientId = "",
//            //    ClientSecret = ""
//            //});
//        }
//    }
//}
