namespace leaguerAPI.Models
{
    public class Team
    {
        public Guid Id { get; set; }
        public Guid LeagueId { get; set; }
        public string Name { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }

        public League League { get; set; }
        public ICollection<TeamUser> TeamUsers { get; set; }
        public ICollection<EventTeam> EventTeams { get; set; }
    }
}
