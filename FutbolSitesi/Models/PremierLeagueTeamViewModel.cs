using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FutbolSitesi.Models
{
    public class PremierLeagueTeamViewModel
    {
        public string Name { get; set; }
        public int MatchesPlayed { get; set; }
        public int Wins { get; set; }
        public int Draws { get; set; }
        public int Losses { get; set; }
        public int GoalsScored { get; set; }
        public int GoalsConceded { get; set; }
        public int GoalDifference { get; set; }
        public int Points { get; set; }
        public string Coach { get; set; }
        public string ImageUrl { get; set; }
    }
}