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
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri($"https://api-football-v1.p.rapidapi.com/players/2024/{id}"),
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
                        var apiData = jsonData["api"];
                        var playersData = apiData["players"];

                        var team = new Team
                        {
                            Id = id,
                            Name = "Takım Adı", // API'den gelen yanıtta takım adı yok
                            Logo = "https://via.placeholder.com/100", // API'den gelen yanıtta logo yok
                            Players = new List<Player>()
                        };

                        foreach (var playerData in playersData)
                        {
                            var player = new Player
                            {
                                Name = (string)playerData["player"],
                                Number = int.Parse((string)playerData["number"])
                            };
                            team.Players.Add(player);
                        }

                        return View(team);
                    }
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Details", new { id = id });
            }
        }
    }
} 