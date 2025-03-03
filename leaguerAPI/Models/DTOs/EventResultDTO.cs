namespace leaguerAPI.Models.DTOs
{
    public class EventResultDTO
    {
        public EventResultDTO(EventResult eventResult)
        {
            Id = eventResult.Id;
            EventId = eventResult.EventId;
            WinningTeamId = eventResult.WinningTeamId;
            WinningUserId = eventResult.WinningUserId;
            Score = eventResult.Score;
            StarPlayerUserId = eventResult.StarPlayerUserId;
        }

        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid? WinningTeamId { get; set; }
        public Guid? WinningUserId { get; set; }
        public string Score { get; set; }
        public Guid? StarPlayerUserId { get; set; }
    }
}
