using System;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.Threading;
using System.Web.Http;
using Elal.FlightPostponed.DataModel.ViewModel;
using System.Collections.Generic;

namespace Elal.FlightPostponed.MobileWeb.Controllers
{
    #region LockHub
    public class LockHub : Hub
    {
        public async Task Subscribe(string channel)
        {
            await Groups.Add(Context.ConnectionId, channel);

            var ev = new SessionStatus();
            ev.Users = new List<UserHandle>();
            ev.State = (int)StateSignalREnum.Sub;
            await Publish(ev);
        }


        public Task Publish(SessionStatus channelEvent)
        {
            Clients.Group(SessionStatus.TaskChannel).OnEvent(SessionStatus.TaskChannel, channelEvent);
            return Task.FromResult(0);
        }


        public override Task OnConnected()
        {
            var ev = new SessionStatus();
            ev.Users = new List<UserHandle>();
            ev.State = (int)StateSignalREnum.Sub;

            Publish(ev);

            return base.OnConnected();
        }


        public override Task OnDisconnected(bool stopCalled)
        {
            var ev = new SessionStatus();
            ev.Users = new List<UserHandle>();
            ev.State = (int)StateSignalREnum.UnSub;

            Publish(ev);
             
            return base.OnDisconnected(stopCalled);
        }

    }
}
    #endregion

   

   
 
    

  