namespace leaguerAPI.Models.DTOs
{
    public class EventInputDTO
    {
        public Guid LeagueId { get; set; }
        public string Location { get; set; }
        public DateTime EventTime { get; set; }
        public List<Guid> OpponentIds { get; set; }
    }
}
