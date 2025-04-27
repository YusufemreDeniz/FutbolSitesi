using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;
using FutbolSitesi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace FutbolSitesi.Controllers
{
    public class TeamController : Controller
    {
        public async Task<ActionResult> GetTeams()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri("https://api-football-v1.p.rapidapi.com/v3/teams"),
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
                        
                        // JSON'ı işle
                        var jsonData = JObject.Parse(body);
                        var teams = new List<Team>();

                        foreach (var item in jsonData["response"])
                        {
                            var teamData = item["team"];
                            var venueData = item["venue"];

                            var team = new Team
                            {
                                Id = (int)teamData["id"],
                                Name = (string)teamData["name"],
                                Logo = (string)teamData["logo"],
                                Country = (string)teamData["country"],
                                Founded = (int)teamData["founded"],
                                Venue = (string)venueData["name"],
                                City = (string)venueData["city"],
                                Address = (string)venueData["address"],
                                Website = (string)teamData["website"]
                            };

                            teams.Add(team);
                        }

                        return Json(teams, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<ActionResult> Details(int id)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri($"https://api-football-v1.p.rapidapi.com/v3/teams?id={id}"),
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
                        
                        // JSON'ı işle
                        var jsonData = JObject.Parse(body);
                        var teamData = jsonData["response"][0]["team"];
                        var venueData = jsonData["response"][0]["venue"];

                        var team = new Team
                        {
                            Id = (int)teamData["id"],
                            Name = (string)teamData["name"],
                            Logo = (string)teamData["logo"],
                            Country = (string)teamData["country"],
                            Founded = (int)teamData["founded"],
                            Venue = (string)venueData["name"],
                            City = (string)venueData["city"],
                            Address = (string)venueData["address"],
                            Website = (string)teamData["website"]
                        };

                        return View(team);
                    }
                }
            }
            catch (Exception )
            {
                // Hata durumunda ana sayfaya yönlendir
                return RedirectToAction("Index", "Home");
            }
        }

public async Task<ActionResult> Squad(int id)
{
    try
    {
        // 1. Oyuncuları çek
        using (var client = new HttpClient())
        {
            // Oyuncular için istek
            var playerRequest = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://api-football-v1.p.rapidapi.com/v3/players?team={id}&season=2024"),
                        Headers =
                        {
                            { "x-rapidapi-key", "0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032" },
                            { "x-rapidapi-host", "api-football-v1.p.rapidapi.com" },
                        },
            };

            var playerResponse = await client.SendAsync(playerRequest);
            playerResponse.EnsureSuccessStatusCode();
            var playerBody = await playerResponse.Content.ReadAsStringAsync();
            var playerJson = JObject.Parse(playerBody);
            var playersData = playerJson["response"];

            // 2. Takım adı ve logosu için standings endpointine istek
            var teamRequest = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri("https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=2024"),
                        Headers =
                        {
                            { "x-rapidapi-key", "0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032" },
                            { "x-rapidapi-host", "api-football-v1.p.rapidapi.com" },
                        },
            };

            var teamResponse = await client.SendAsync(teamRequest);
            teamResponse.EnsureSuccessStatusCode();
            var teamBody = await teamResponse.Content.ReadAsStringAsync();
            var teamJson = JObject.Parse(teamBody);
            var teams = teamJson["response"][0]["league"]["standings"][0];

            string teamName = "";
            string teamLogo = "";

            foreach (var t in teams)
            {
                var teamIdToken = t["team"]?["id"];
                int teamId = 0;
                if (teamIdToken != null && int.TryParse(teamIdToken.ToString(), out teamId))
                {
                    if (teamId == id)
                    {
                        teamName = (string)t["team"]["name"];
                        teamLogo = (string)t["team"]["logo"];
                        break;
                    }
                }
            }

            var team = new Team
            {
                Id = id,
                Name = teamName,
                Logo = teamLogo,
                Players = new List<Player>()
            };

            foreach (var playerData in playersData)
            {
                string numberStr = playerData["statistics"]?[0]?["games"]?["number"]?.ToString();
                int number = 0;
                int.TryParse(numberStr, out number);

                var player = new Player
                {
                    Name = (string)playerData["player"]["name"],
                    Number = number
                };
                team.Players.Add(player);
            }

            return View(team);
        }
    }
    catch (Exception)
    {
        return RedirectToAction("Details", new { id = id });
    }
}
    }
} 