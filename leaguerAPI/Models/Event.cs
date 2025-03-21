using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Location { get; set; }
        public Guid? LeagueId { get; set; }
        public DateTime EventTime { get; set; }
        public Guid Createdby { get; set; }
        public EventJoinType JoinType { get; set; }
        public EventType EventType { get; set; }
        public int MaxParticipants { get; set; }
        public bool IsTeamEvent { get; set; }


        public League? League { get; set; }
        public User CreatedByUser { get; set; }
        public EventResult EventResult { get; set; }
        public ICollection<EventUser> EventUsers { get; set; }
        public ICollection<EventTeam> EventTeams { get; set; }
        public ICollection<Match> Matches { get; set; }
    }
}
