using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FutbolSitesi.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public string Country { get; set; }
        public int Founded { get; set; }
        public string Venue { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
    }
}