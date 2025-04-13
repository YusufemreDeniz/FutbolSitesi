
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace FutbolSitesi.Models
{
    internal class TeamDetails
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public int? Founded { get; set; }
        public string Logo { get; set; }
        public string VenueName { get; set; }
        public string VenueCity { get; set; }
        public int? VenueCapacity { get; set; }
    }
}