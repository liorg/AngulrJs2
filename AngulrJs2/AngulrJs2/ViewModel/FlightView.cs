using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Elal.FlightPostponed.ViewModel
{
    [JsonObject("flight")]
    public class FlightView
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("number")]
        public string Num { get; set; }
        [JsonProperty("departure")]
        public string Departure { get; set; }
        [JsonProperty("destination")]
        public string Destination { get; set; }
        [JsonIgnore]
        public DateTime? DepartureDates { get; set; }
        [JsonIgnore]
        public DateTime? ArrivedDates { get; set; }

        [JsonProperty("departureDates")]
        public string DepartureDatesStr
        {
            get
            {
                return DepartureDates.HasValue ? DepartureDates.Value.ToString("dd MMM yyyy") : "";
            }
        }

        [JsonProperty("departureTime")]
        public string DepartureTimeStr
        {
            get
            {
                return DepartureDates.HasValue ? DepartureDates.Value.ToString("hh:mm tt") : "";
            }
        }

        [JsonProperty("arrivedDates")]
        public string ArrivedDatesStr
        {
            get
            {
                return ArrivedDates.HasValue ? ArrivedDates.Value.ToString("dd MMM yyyy") : "";
            }
        }

        [JsonProperty("arrivedTime")]
        public string ArrivedTimetr
        {
            get
            {
                return ArrivedDates.HasValue ? ArrivedDates.Value.ToString("hh:mm tt") : "";
            }
        }

        [JsonProperty("isSelected")]
        // [Required]
        public bool IsSelected { get; set; }
    }
}
