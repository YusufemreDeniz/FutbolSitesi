using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FutbolSitesi.Models
{
    public class Player
    {
        public string _id { get; set; }
        public string name { get; set; }
        public string team { get; set; }
        public string country { get; set; }
        public string position { get; set; }
        public int age { get; set; }
        public DateTime dateOfBirth { get; set; }
        public double height { get; set; }
        public int shirtNumber { get; set; }
        public int goals { get; set; }
        public int assists { get; set; }
        public int appearances { get; set; }
        public int firstTeamAppearances { get; set; }
        public int minutesPlayed { get; set; }
        public int yellowCards { get; set; }
        public int redCards { get; set; }
    }
}