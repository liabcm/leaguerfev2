namespace leaguerAPI.Models.DTOs
{
    public class EventDTO
    {
        public EventDTO()
        {
        }
        public EventDTO(Event @event)
        {
            Id = @event.Id;
            Location = @event.Location;
            LeagueId = @event.LeagueId;
            EventTime = @event.EventTime;
            IsConfirmed = @event.IsConfirmed;
            CreatedBy = @event.Createdby;
            Users = @event.EventUsers?.Select(eu => new EventUserDTO(eu)).ToList();
            Teams = @event.EventTeams?.Select(et => new EventTeamDTO(et, false)).ToList();
            EventResult = @event.EventResult != null ? new EventResultDTO(@event.EventResult, false) : null;
            TeamPlayers = @event.EventTeams?
            .SelectMany(et => et.Team?.TeamUsers ?? Enumerable.Empty<TeamUser>())
            .Select(tu => new UserDTO(tu.User))
            .ToList() ?? new List<UserDTO>();
        }
        public Guid Id { get; set; }
        public string Location { get; set; }
        public Guid LeagueId { get; set; }
        public DateTime EventTime { get; set; }
        public bool IsConfirmed { get; set; }
        public Guid CreatedBy { get; set; }
        public EventResultDTO? EventResult { get; set; }
        public List<EventUserDTO>? Users { get; set; }
        public List<EventTeamDTO>? Teams { get; set; }
        public List<UserDTO> TeamPlayers { get; set; }
    }
}
