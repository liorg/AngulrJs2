using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AngulrJs2.ViewModel
{
    [JsonObject("profile")]
    public class Profile
    {
        [JsonProperty("id")]
        public string UserId { get; set; }

        [JsonProperty("name")]
        public string FullName { get; set; }

        [JsonProperty("domain")]
        public string DomainName { get; set; }

        [JsonProperty("loginDateYear")]
        public string LoginDateYear { get; set; }


        [JsonProperty("loginDateDay")]
        public string LoginDateDay { get; set; }

        [JsonProperty("loginDateHour")]
        public string LoginDateHour { get; set; }

        [JsonProperty("loginDateNum")]
        public string LoginDateNum { get; set; }

        [JsonProperty("loginDateMonth")]
        public string LoginDateMonth { get; set; }

    }
}
