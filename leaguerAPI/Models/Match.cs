namespace leaguerAPI.Models
{
    public class Match
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid Opponent1Id { get; set; }
        public Guid Opponent2Id { get; set; }
        public int MatchNumber { get; set; }
        public int Round { get; set; }
        public ManualResetEvent? MatchResult { get; set; }
        public Event Event { get; set; }
    }

    public class MatchResultModel
    {
        public string WinnerName { get; set; }
        public string LoserName { get; set; }
        public string Score { get; set; }
    }
}
