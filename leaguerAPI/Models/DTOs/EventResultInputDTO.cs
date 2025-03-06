namespace leaguerAPI.Models.DTOs
{
    public class EventResultInputDTO
    {
        public Guid EventId { get; set; }
        public Guid WinningId { get; set; }
        public Guid LosingId { get; set; }
        public string Score { get; set; }
        public Guid? StarPlayerUserId { get; set; }
    }
}
