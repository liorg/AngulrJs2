using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Elal.FlightPostponed.MobileWeb.Controllers
{
    [RoutePrefix("api/Crm")]
    public class CrmController : ApiController
    {

        [Route("Ping")]
        [HttpGet]
        public IHttpActionResult Ping()
        {
         
            return Ok("ping me!!!");
        }
    }
}
