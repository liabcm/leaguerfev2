namespace leaguerAPI.Models.DTOs
{
    public class MatchDTO
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid Opponent1Id { get; set; }
        public Guid Opponent2Id { get; set; }
        public int MatchNumber { get; set; }
        public int Round { get; set; }
        public ManualResetEvent? MatchResult { get; set; }
        public EventDTO Event { get; set; }
    }
}
