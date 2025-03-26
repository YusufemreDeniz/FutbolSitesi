using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using FutbolSitesi.Models;
using FutbolSitesi.Services;

namespace FutbolSitesi.Controllers
{
    public class HomeController : Controller
    {
        private readonly PremierLeagueService _premierLeagueService;
        public HomeController()
        {
            _premierLeagueService = new PremierLeagueService();  // Servisi manuel başlatıyoruz
        }

        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> PremierLeague()
        {
            var teamsJson = await _premierLeagueService.GetPremierLeagueTeams();

            if (teamsJson == null)
            {
                // Eğer JSON verisi yoksa, kullanıcıya hata mesajı verebiliriz
                return View("Error");
            }

            var teams = teamsJson.Select(team => new PremierLeagueTeamViewModel
            {
                Name = (string)team["name"],
                MatchesPlayed = (int)team["matchesPlayed"],
                Wins = (int)team["wins"],
                Draws = (int)team["draws"],
                Losses = (int)team["losses"],
                GoalsScored = (int)team["goalsScored"],
                GoalsConceded = (int)team["goalsConceded"],
                GoalDifference = (int)team["goalDifference"],
                Points = (int)team["points"],
                Coach = (string)team["coach"],
                ImageUrl = (string)team["imageUrl"]
            })
            .OrderByDescending(t => t.Points)
            .ToList();

            return View(teams);
        }
    }
}
