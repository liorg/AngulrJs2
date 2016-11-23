using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Elal.FlightPostponed.MobileWeb.Models
{
    public class PlaneSeatsArrangement
    {
        [JsonProperty(PropertyName = "userid")]
        public int UserId { get; set; }

        [JsonProperty(PropertyName = "seatnumber")]
        public int SeatNumber { get; set; }
    }
}