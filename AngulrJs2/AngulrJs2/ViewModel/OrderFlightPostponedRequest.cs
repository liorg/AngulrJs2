using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Elal.FlightPostponed.DataModel
{
    [JsonObject("orderFlightPostponedRequest")]
    public class OrderFlightPostponedRequest
    {
        [JsonProperty("flight")]
        public  string Flight { get; set; }
        [JsonProperty("handleBy")]
        public string HandleBy { get; set; }
        [JsonProperty("passangers")]
        public List<Guid> Passangers { get; set; }

    }
}
