namespace leaguerAPI.Models
{
    public class EventResult
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid? WinningTeamId { get; set; }
        public Guid? WinningUserId { get; set; }
        public Guid? LosingTeamId { get; set; }
        public Guid? LosingUserId { get; set; }
        public string Score { get; set; }
        public Guid? StarPlayerUserId { get; set; }

        public Event Event { get; set; }
        public Team? WinningTeam { get; set; }
        public User? WinningUser { get; set; }
        public Team? LosingTeam { get; set; }
        public User? LosingUser { get; set; }
        public User? StarPlayerUser { get; set; }
    }
}
