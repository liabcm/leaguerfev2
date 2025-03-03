namespace leaguerAPI.Models.DTOs
{
    public class EventResultInputDTO
    {
        public Guid EventId { get; set; }
        public Guid? WinningTeamId { get; set; }
        public Guid? WinningUserId { get; set; }
        public string Score { get; set; }
        public Guid? StarPlayerUserId { get; set; }
    }
}
