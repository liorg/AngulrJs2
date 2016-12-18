using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace AngulrJs2.ViewModel
{
    [JsonObject("resultbase")]
    public class Result
    {
        [JsonProperty("isErr")]
        public bool IsErr { get; set; }
        [JsonProperty("desc")]
        public string ErrDesc { get; set; }
    }
    [JsonObject("result")]
    public class Result<T> : Result
    {
        [JsonProperty("model")]
        public T Model { get; set; }
    }
}
