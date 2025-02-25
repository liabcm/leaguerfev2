namespace leaguerAPI.Models.DTOs
{
    public class EventTeamDTO
    {
        public EventTeamDTO(EventTeam eventTeam)
        {
            TeamId = eventTeam.TeamId;
            EventId = eventTeam.EventId;
            Name = eventTeam.Team?.Name;
        }

        public Guid TeamId { get; set; }
        public Guid EventId { get; set; }
        public string? Name { get; set; }
    }
}
