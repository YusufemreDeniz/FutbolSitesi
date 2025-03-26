using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FutbolSitesi.Models
{
    public class Team
    {
        public string _id { get; set; }
        public string name { get; set; }
        public List<Player> players { get; set; }
    }
}