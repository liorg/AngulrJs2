using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elal.FlightPostponed.DataModel.ViewModel
{
    public class HotelsViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public int RoomsLeft { get; set; }
    }
}
