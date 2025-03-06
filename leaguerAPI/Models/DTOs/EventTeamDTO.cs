namespace leaguerAPI.Models.DTOs
{
    public class EventTeamDTO
    {
        public EventTeamDTO()
        {
        }
        public EventTeamDTO(EventTeam eventTeam, bool includeEvents = true)
        {
            TeamId = eventTeam.TeamId;
            EventId = eventTeam.EventId;
            Event = eventTeam.Event != null && includeEvents ? new EventDTO(eventTeam.Event) : null;
            Name = eventTeam.Team?.Name;
        }

        public Guid TeamId { get; set; }
        public Guid EventId { get; set; }
        public string? Name { get; set; }
        public EventDTO? Event { get; set; }
    }
}
