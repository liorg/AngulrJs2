using AngulrJs2.ViewModel;
//using log4net;
//using log4net.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace AngulrJs2.Controllers
{
    [RoutePrefix("api/Crm")]
    public class CrmController : ApiController
    {

        [Route("Ping")]
        [HttpGet]
        public IHttpActionResult Ping(string logger)
        {
            //XmlConfigurator.Configure();
            //var log = LogManager.GetLogger(this.GetType());
            //log.Error("sss");

            return Ok("ping me!!!");
        }


        [Route("GetCurrentProfile")]
        [AcceptVerbs("GET")]
        public HttpResponseMessage GetCurrentProfileSync()
        {
            Result<Profile> result = new Result<Profile>();
            var username = System.Security.Principal.WindowsIdentity.GetCurrent().Name;// HttpContext.Current.User.Identity.Name;
            result.IsErr = false;
            result.Model = new Profile
            {
                UserId = Guid.NewGuid().ToString(),
                FullName = username,
                LoginDateYear = DateTime.Now.Year.ToString(),
                LoginDateMonth = DateTime.Now.Month.ToString(),
                LoginDateHour = DateTime.Now.ToShortTimeString(),
                LoginDateNum = DateTime.Now.Day.ToString(),
                LoginDateDay = "TODO",
                DomainName = username
            };

            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<Result>(result,
                           new JsonMediaTypeFormatter(),
                            new MediaTypeWithQualityHeaderValue("application/json"))
            };
            response.Headers.CacheControl = new CacheControlHeaderValue();
            response.Headers.CacheControl.NoStore = true;
            return response;
        }



        [Route("GetProducts")]
        [AcceptVerbs("GET")]
        public HttpResponseMessage GetProducts()
        {
            List<Product> products = new List<Product>();
            products.Add(new Product
            {

                description = "dd",
                imageUrl = "www",
                productCode = "32",
                productName = "test mwe",
                price = 2.2,
                productId = 231232,
                releaseDate = "3232",
                starRating = 3.2

            });
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<List<Product>>(products,
               new JsonMediaTypeFormatter(),
                new MediaTypeWithQualityHeaderValue("application/json"))
            };
            response.Headers.CacheControl = new CacheControlHeaderValue();
            response.Headers.CacheControl.NoStore = true;
            return response;
        }

        void ErrorHandle(Exception e)
        {
            //XmlConfigurator.Configure();
            //var log = LogManager.GetLogger(this.GetType());
            //log.Error("error occuer", e);
        }
    }

}
