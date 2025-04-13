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
            var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri("https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=2024"),
                Headers =
                {
                    { "x-rapidapi-key", "0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032" },
                    { "x-rapidapi-host", "api-football-v1.p.rapidapi.com" },
                },
            };
            using (var response = await client.SendAsync(request))
            {
                response.EnsureSuccessStatusCode();
                var body = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(body);
                var standings = jsonObject["response"][0]["league"]["standings"][0];

                if (standings == null)
                {
                    return View("Error");
                }

                var teams = standings.Select(team => new PremierLeagueTeamViewModel
                {
                    TeamId = (int)team["team"]["id"],
                    Name = (string)team["team"]["name"],
                    MatchesPlayed = (int)team["all"]["played"],
                    Wins = (int)team["all"]["win"],
                    Draws = (int)team["all"]["draw"],
                    Losses = (int)team["all"]["lose"],
                    GoalsScored = (int)team["all"]["goals"]["for"],
                    GoalsConceded = (int)team["all"]["goals"]["against"],
                    GoalDifference = (int)team["goalsDiff"],
                    Points = (int)team["points"],
                    ImageUrl = (string)team["team"]["logo"]
                })
                .OrderByDescending(t => t.Points)
                .ToList();

                return View(teams);
            }
        }
    }
}