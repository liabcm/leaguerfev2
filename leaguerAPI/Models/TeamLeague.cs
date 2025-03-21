namespace leaguerAPI.Models
{
    public class TeamLeague
    {
        public Guid TeamId { get; set; }
        public Guid LeagueId { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public Team Team { get; set; }
        public League League { get; set; }
    }
}
