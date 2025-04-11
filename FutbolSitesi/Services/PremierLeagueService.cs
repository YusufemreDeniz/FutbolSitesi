using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace FutbolSitesi.Services
{
    public class PremierLeagueService
    {
        private readonly HttpClient _httpClient;

        public PremierLeagueService()
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("x-rapidapi-key", "0d227b63camshccb09c48c177a0dp1cc339jsn62cbe5669032");
            _httpClient.DefaultRequestHeaders.Add("x-rapidapi-host", "premier-league18.p.rapidapi.com");
        }

        public async Task<JArray> GetPremierLeagueTeams()
        {
            var requestUrl = "https://premier-league18.p.rapidapi.com/teams";
            HttpResponseMessage response = await _httpClient.GetAsync(requestUrl);

            if (response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                return JArray.Parse(body);
            }
            else
            {
                throw new Exception("Premier League API isteği başarısız oldu.");
            }
        }
    }
}
