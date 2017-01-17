using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elal.FlightPostponed.DataModel.ViewModel
{
    [JsonObject("userHandle")]
    public class UserHandle
    {
        [JsonProperty("userid")]
        public string UserId { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }
 
        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("passangers")]
        public List<PassangerLocked> PassangersLocked { get; set; }
    }

    [JsonObject("passangerLocked")]
    public class PassangerLocked
    {
      
        [JsonProperty("passangerid")]
        public string PassangerId { get; set; }

        [JsonProperty("isLocked")]
        public bool IsLocked { get; set; }

     
     
    }


    public enum StateSignalREnum { Sub=0,Pub=1,UnSub=2};
    public class SessionStatus
    {
        public const string TaskChannel = "tasks";

        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }

        [JsonProperty("users")]
        public List<UserHandle> Users { get; set; }

        [JsonProperty("state")]
        public int State { get; set; }
        public SessionStatus()
        {
            Timestamp = DateTimeOffset.Now.Date;
        }
    }
}
