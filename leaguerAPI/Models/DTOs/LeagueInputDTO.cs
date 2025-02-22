namespace leaguerAPI.Models.DTOs
{
    public class LeagueInputDTO
    {
        public Guid? Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sport { get; set; } = string.Empty;
        public bool isPublic { get; set; }
        public bool isCompetitive { get; set; }
        public bool IsTeamLeague { get; set; }
    }
}
