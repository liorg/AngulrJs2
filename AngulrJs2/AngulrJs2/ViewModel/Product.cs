using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngulrJs2.ViewModel
{
    /*
     *   "productId": 1,
        "productName": "Leaf Rake",
        "productCode": "GDN-0011",
        "releaseDate": "March 19, 2016",
        "description": "Leaf rake with 48-inch wooden handle.",
        "price": 19.95,
        "starRating": 3.2,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
     */
    [JsonObject("Product")]
    public class Product
    {
        [JsonProperty("productId")]
        public int productId { get; set; }

        [JsonProperty("productName")]
        public string productName { get; set; }

        [JsonProperty("releaseDate")]
        public string releaseDate { get; set; }

        [JsonProperty("productCode")]
        public string productCode { get; set; }

        [JsonProperty("description")]
        public string description { get; set; }


        [JsonProperty("price")]
        public double price { get; set; }

        [JsonProperty("starRating")]
        public double starRating { get; set; }


        [JsonProperty("imageUrl")]
        public string imageUrl { get; set; }


    }
}