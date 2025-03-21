namespace leaguerAPI.Models
{
    public class League
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sport { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool isPublic { get; set; }
        public bool isCompetitive { get; set; }
        public Guid CreatedBy { get; set; }
        public bool IsTeamLeague { get; set; }
        public ICollection<LeagueUser> LeagueUsers { get; set; }
        public ICollection<Event> Events { get; set; }
        public ICollection<TeamLeague> TeamLeagues { get; set; }
    }
}
