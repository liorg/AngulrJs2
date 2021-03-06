﻿using Elal.FlightPostponed.Dal;
using Elal.FlightPostponed.DataModel;
using Elal.FlightPostponed.DataModel.ViewModel;
using Elal.FlightPostponed.Logic;
using Elal.FlightPostponed.ViewModel;
using log4net;
using log4net.Config;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Elal.FlightPostponed.Contract.Utils;

namespace Elal.FlightPostponed.MobileWeb.Controllers
{
    [RoutePrefix("api/Crm")]
    public class CrmController : ApiController
    {
        private IHubContext _context;
        public CrmController()
        {
            _context = GlobalHost.ConnectionManager.GetHubContext<LockHub>();
        }

        [Route("sendNotity")]
        [HttpPost]
        public async Task<HttpResponseMessage> ChangeStatusPassanners(UserHandle user)
        {
            Result<string> result = new Result<string>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {
                    string channel = "lockedChanges";
                    var ev = new SessionStatus();
                    ev.Users = new List<UserHandle> { user };
                    ev.State = (int)StateSignalREnum.Pub;
                    FlightLogic logic = new FlightLogic(new Dal.Repository.FlightRepository(context), new Dal.Repository.FlightPostponedRepository(context));
                    var trackid = await logic.PassangersHandleUser(user);
                    //Guid tarckId = Guid.NewGuid();
                    ev.TrackId = trackid.ToString();
                    //_context.Clients.Group(SessionStatus.TaskChannel).GetNotify(channel, ev);
                    PulishEvent(channel, ev);
                    result.Model = ev.TrackId;

                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }
            }
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

        private void PulishEvent(string channel, SessionStatus ev)
        {
            // _context.Clients.Group(SessionStatus.TaskChannel).GetNotify(channel, ev);
            _context.Clients.All.GetNotify(channel, ev);

            // throw new NotImplementedException();
        }

        [HttpGet]
        [Route("t")]
        public IHttpActionResult StatusPassanners(string p = "")
        {
            Guid id = Guid.NewGuid();
            string channel = SessionStatus.TaskChannel;// "lockedChanges";
            var ev = new SessionStatus();
            ev.Users = new List<UserHandle>();
            Guid tarckId = Guid.NewGuid();
            var user = new UserHandle
            {
                UserId = Guid.Parse("D897C355-DA9E-E111-8DD2-015056B70063").ToString(),
                Name = "xxx"
            };
            Guid.TryParse(p, out id);


            user.PassangersLocked = new List<PassangerLocked>();
            ev.State = (int)StateSignalREnum.Pub;
            user.PassangersLocked = new List<PassangerLocked>();
            user.PassangersLocked.Add(new PassangerLocked { IsLocked = true, PassangerId = Guid.Parse("28270C47-DA8B-46E9-AF9A-000094D1A000").ToString() });
            user.PassangersLocked.Add(new PassangerLocked { IsLocked = true, PassangerId = id.ToString() });
            ev.Users.Add(user);
            //_context.Clients.Group(SessionStatus.TaskChannel).GetNotify(channel, ev);
            PulishEvent(channel, ev);
            return Ok(tarckId.ToString());
        }

        [Route("Ping")]
        [HttpGet]
        public IHttpActionResult Ping(string logger)
        {
            XmlConfigurator.Configure();
            var log = LogManager.GetLogger(this.GetType());
            log.Error("sss");
            return Ok("ping me!!!");
        }

        [Route("GetCurrentProfileSync")]
        [AcceptVerbs("GET")]
        public HttpResponseMessage GetCurrentProfileSync()
        {
            Result<Profile> result = new Result<Profile>();
            var username = System.Security.Principal.WindowsIdentity.GetCurrent().Name;// HttpContext.Current.User.Identity.Name;
            result.IsErr = false;
            result.Model = new Profile
            {
                UserId = Guid.NewGuid().ToString(),
                FullName = "TODO TODO",
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

        [Route("GetCurrentProfile")]
        [AcceptVerbs("GET")]
        public async Task<HttpResponseMessage> GetCurrentProfileAsync()
        {
            Result<Profile> result = new Result<Profile>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {
                    var username = System.Security.Principal.WindowsIdentity.GetCurrent().Name;// HttpContext.Current.User.Identity.Name;

                    UserLogic user = new UserLogic(new Dal.Repository.UserRepository(context));
                    var profileuser = await user.GetProfile(username);

                    result.IsErr = false;
                    result.Model = new Profile
                    {
                        UserId = profileuser.UserId,
                        FullName = profileuser.FullName,
                        LoginDateYear = DateTime.Now.Year.ToString(),
                        LoginDateMonth = DateTime.Now.Month.ToString(),
                        LoginDateHour = DateTime.Now.ToShortTimeString(),
                        LoginDateNum = DateTime.Now.Day.ToString(),
                        LoginDateDay = "TODO",
                        DomainName = profileuser.DomainName
                    };

                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }


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
        }

        [Route("SearchFlight")]
        [AcceptVerbs("GET")]
        public async Task<HttpResponseMessage> SearchFlight(string flight)
        {
            Result<List<FlightView>> result = new Result<List<FlightView>>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {
                    FlightLogic logic = new FlightLogic(new Dal.Repository.FlightRepository(context), new Dal.Repository.FlightPostponedRepository(context));
                    result.Model = await logic.SearchFlight(flight);
                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }


                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Result<List<FlightView>>>(result,
                               new JsonMediaTypeFormatter(),
                                new MediaTypeWithQualityHeaderValue("application/json"))
                };
                response.Headers.CacheControl = new CacheControlHeaderValue();
                response.Headers.CacheControl.NoStore = true;
                return response;
            }
        }


        [Route("FindFlight")]
        [AcceptVerbs("GET")]
        public async Task<HttpResponseMessage> FindFlight(string flight)
        {
            Result<FlightView> result = new Result<FlightView>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {
                    FlightLogic logic = new FlightLogic(new Dal.Repository.FlightRepository(context), new Dal.Repository.FlightPostponedRepository(context));

                    result.Model = await logic.FindFlight(flight);
                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }

                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Result<FlightView>>(result,
                               new JsonMediaTypeFormatter(),
                                new MediaTypeWithQualityHeaderValue("application/json"))
                };
                response.Headers.CacheControl = new CacheControlHeaderValue();
                response.Headers.CacheControl.NoStore = true;
                return response;
            }
        }


        [Route("GetAllPassangers")]
        [AcceptVerbs("GET")]
        public async Task<HttpResponseMessage> GetAllPassangers(string flight)
        {
            Result<List<PassengerView>> result = new Result<List<PassengerView>>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {

                    FlightLogic logic = new FlightLogic(new Dal.Repository.FlightRepository(context), new Dal.Repository.FlightPostponedRepository(context));
                    result.Model = await logic.GetAllPassangers(flight);
                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }

                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Result<List<PassengerView>>>(result,
                               new JsonMediaTypeFormatter(),
                                new MediaTypeWithQualityHeaderValue("application/json"))
                };
                response.Headers.CacheControl = new CacheControlHeaderValue();
                response.Headers.CacheControl.NoStore = true;
                return response;
            }
        }

        [Route("GetFlightPassangers")]
        [AcceptVerbs("GET")]
        public async Task<HttpResponseMessage> GetFlightPassangers(string flight, string user, string order)
        {
            Result<ContextPassangers> result = new Result<ContextPassangers>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {

                    FlightLogic logic = new FlightLogic(new Dal.Repository.FlightRepository(context), new Dal.Repository.FlightPostponedRepository(context));
                    result.Model = await logic.GetFlightPassangers(flight, user, order);
                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }

                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Result<ContextPassangers>>(result,
                               new JsonMediaTypeFormatter(),
                                new MediaTypeWithQualityHeaderValue("application/json"))
                };
                response.Headers.CacheControl = new CacheControlHeaderValue();
                response.Headers.CacheControl.NoStore = true;
                return response;
            }
        }



        [Route("CreateNewOrderFlightPostponed")]
        [AcceptVerbs("POST")]
        public async Task<HttpResponseMessage> CreateNewOrderFlightPostponed(OrderFlightPostponedRequest request)
        {
            Result<Guid> result = new Result<Guid>();
            using (FlightPostponedContext context = new FlightPostponedContext())
            {
                try
                {

                    FlightLogic logic = new FlightLogic(new Dal.Repository.FlightRepository(context), new Dal.Repository.FlightPostponedRepository(context));
                    result.Model = await logic.CreateFlightPostponed(request.Flight, request.HandleBy, request.Passangers);

                }
                catch (ErrorLogic errlogic)
                {
                    result.IsErrUnandleException = false;
                    result.IsErr = true;
                    result.TitleErr = errlogic.ErrorTitle;
                    result.ErrDesc = errlogic.Message;
                    ErrorHandle(errlogic);
                }
                catch (Exception e)
                {
                    result.IsErrUnandleException = true;
                    result.IsErr = true;
                    result.TitleErr = ErrorLogic.UNHANDLE_EXCECPTION;
                    result.ErrDesc = e.Message;
                    ErrorHandle(e);
                }


                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ObjectContent<Result<Guid>>(result,
                               new JsonMediaTypeFormatter(),
                                new MediaTypeWithQualityHeaderValue("application/json"))
                };
                response.Headers.CacheControl = new CacheControlHeaderValue();
                response.Headers.CacheControl.NoStore = true;
                return response;
            }
        }

        [Route("GetHotels")]
        [AcceptVerbs("GET")]
        public async Task<HttpResponseMessage> GetHotels()
        {
            var hotelList = new List<HotelsViewModel>();
            using (var file = new StreamReader(@"D:\tfs2015\Elal\FlightPostponed\FlightPostponed\Elal.FlightPostponed.MobileWeb\Elal.FlightPostponed.MobileWeb\Controllers\hotels-list.json"))
            {
                string hotels = file.ReadToEnd();
                hotelList = Newtonsoft.Json.JsonConvert.DeserializeObject<List<HotelsViewModel>>(hotels);
            }
            Result<List<HotelsViewModel>> result = new Result<List<HotelsViewModel>>();
            result.Model = hotelList;
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ObjectContent<Result<List<HotelsViewModel>>>(result,
                              new JsonMediaTypeFormatter(),
                               new MediaTypeWithQualityHeaderValue("application/json"))
            };
            response.Headers.CacheControl = new CacheControlHeaderValue();
            response.Headers.CacheControl.NoStore = true;
            return response;
        }

        void ErrorHandle(Exception e)
        {
            XmlConfigurator.Configure();
            var log = LogManager.GetLogger(this.GetType());
            log.Error("error occuer", e);
        }
    }

}
