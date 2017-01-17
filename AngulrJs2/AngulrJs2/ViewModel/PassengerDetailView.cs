using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Elal.FlightPostponed.DataModel
{
    [JsonObject("passengerDetail")]
    public class PassengerDetailView
    {
        [JsonProperty("id")]
        [Key]
        public Guid Id { get; set; }
        [JsonProperty("firstName")]
        // [Required]
        public string FirstName { get; set; }
        [JsonProperty("lastName")]
        //   [Required]
        public string LastName { get; set; }

        [JsonProperty("title")]
        // [Required]
        public string Title { get; set; }

        [JsonProperty("email")]
        // [Required]
        public string Email { get; set; }

        [JsonProperty("phone")]
        // [Required]
        public string Phone { get; set; }

        [ForeignKey("order")]
        public Guid? OrderId { get; set; }


        [ForeignKey("flight")]
        public Guid? Flight_Id { get; set; }

        [JsonProperty("pnr")]
        // [Required]
        public string Pnr { get; set; }

        [JsonProperty("ticket")]
        // [Required]
        public string Ticket { get; set; }


        [JsonProperty("handlyByName")]
        // [Required]
        public string HandlyByName { get; set; }

        [JsonProperty("isHandleBy")]
        // [Required]
        public bool IsHandleBy { get; set; }

        [JsonProperty("isSelected")]
        public bool IsSelected { get; set; }

        [JsonProperty("isSelecting")]
        public bool IsSelecting { get; set; }

        [JsonProperty("isTrashing")]
        public bool IsTrashing { get; set; }

        [JsonProperty("cabin")]
        public string Cabin { get; set; }

        //[Column("Points")]
        //[EditorBrowsable(EditorBrowsableState.Never)]
        //[DebuggerBrowsable(DebuggerBrowsableState.Never)]
        //public string PointsXml
        //{
        //    get
        //    {
        //        var serializer = new XmlSerializer(typeof(List<Point>));
        //        using (var stringWriter = new StringWriter())
        //        {
        //            serializer.Serialize(stringWriter, Points.ToList());
        //            stringWriter.Flush();
        //            return stringWriter.ToString();
        //        }
        //    }
        //    set
        //    {
        //        var serializer = new XmlSerializer(typeof(List<Point>));
        //        using (var stringReader = new StringReader(value))
        //        {
        //            Points = (List<Point>)serializer.Deserialize(stringReader);
        //        }
        //    }
        //}

    }
}
