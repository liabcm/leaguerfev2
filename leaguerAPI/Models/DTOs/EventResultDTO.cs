namespace leaguerAPI.Models.DTOs
{
    public class EventResultDTO
    {
        public EventResultDTO()
        {
        }
        public EventResultDTO(EventResult eventResult, bool includeEvent = true)
        {
            Id = eventResult.Id;
            EventId = eventResult.EventId;
            WinningTeamId = eventResult.WinningTeamId;
            WinningUserId = eventResult.WinningUserId;
            LosingTeamId = eventResult.LosingTeamId;
            LosingUserId = eventResult.LosingUserId;
            Score = eventResult.Score;
            StarPlayerUserId = eventResult.StarPlayerUserId;
            Event = eventResult.Event != null && includeEvent ? new EventDTO(eventResult.Event) : null;
            WinningTeam = eventResult.WinningTeam != null ? new TeamDTO(eventResult.WinningTeam) : null;
            WinningUser = eventResult.WinningUser != null ? new UserDTO(eventResult.WinningUser) : null;
            LosingTeam = eventResult.LosingTeam != null ? new TeamDTO(eventResult.LosingTeam) : null;
            LosingUser = eventResult.LosingUser != null ? new UserDTO(eventResult.LosingUser) : null;
        }

        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid? WinningTeamId { get; set; }
        public Guid? WinningUserId { get; set; }
        public Guid? LosingTeamId { get; set; }
        public Guid? LosingUserId { get; set; }
        public string Score { get; set; }
        public Guid? StarPlayerUserId { get; set; }
        public User? StarPlayerUser { get; set; }
        public EventDTO? Event { get; set; }
        public TeamDTO? WinningTeam { get; set; }
        public UserDTO? WinningUser { get; set; }
        public TeamDTO? LosingTeam { get; set; }
        public UserDTO? LosingUser { get; set; }
    }
}
