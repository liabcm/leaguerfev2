using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models.DTOs
{
    public class EventInputDTO
    {
        public Guid? LeagueId { get; set; }
        public string Location { get; set; }
        public DateTime EventTime { get; set; }
        public List<Guid> OpponentIds { get; set; }
        public int MaxParticipants { get; set; }
        public bool IsTeamEvent { get; set; }
        public EventJoinType JoinType { get; set; }
        public EventType EventType { get; set; }
        public List<CreateMatchDTO>? CreateMatchDTOs { get; set; }
    }
}
