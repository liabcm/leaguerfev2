using leaguerAPI.Models.Enums;

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
            CreatedBy = @event.Createdby;
            EventType = @event.EventType;
            IsTeamEvent = @event.IsTeamEvent;
            JoinType = @event.JoinType;
            Users = @event.EventUsers?.Where(eu => eu.Status == EventUserStatus.Member).Select(eu => new EventUserDTO(eu)).ToList();
            MemberInvites = @event.EventUsers?.Where(eu => eu.Status == EventUserStatus.Invited).Select(eu => new EventUserDTO(eu)).ToList();
            MemberRequests = @event.EventUsers?.Where(eu => eu.Status == EventUserStatus.Requested).Select(eu => new EventUserDTO(eu)).ToList();
            Teams = @event.EventTeams?.Select(et => new EventTeamDTO(et, false)).ToList();
            EventResult = @event.EventResult != null ? new EventResultDTO(@event.EventResult, false) : null;
            TeamPlayers = @event.EventTeams?
            .SelectMany(et => et.Team?.TeamUsers ?? Enumerable.Empty<TeamUser>())
            .Select(tu => new UserDTO(tu.User))
            .ToList() ?? new List<UserDTO>();
        }
        public Guid Id { get; set; }
        public string Location { get; set; }
        public Guid? LeagueId { get; set; }
        public DateTime EventTime { get; set; }
        public bool IsTeamEvent { get; set; }
        public Guid CreatedBy { get; set; }
        public EventType EventType { get; set; }
        public EventJoinType JoinType { get; set; }
        public EventResultDTO? EventResult { get; set; }
        public List<EventUserDTO>? Users { get; set; }
        public List<EventUserDTO>? MemberInvites { get; set; }
        public List<EventUserDTO>? MemberRequests { get; set; }
        public List<EventTeamDTO>? Teams { get; set; }
        public List<UserDTO> TeamPlayers { get; set; }
    }
}
