namespace leaguerAPI.Models.DTOs
{
    public class EventDTO
    {
        public EventDTO(Event @event)
        {
            Id = @event.Id;
            Location = @event.Location;
            LeagueId = @event.LeagueId;
            EventTime = @event.EventTime;
            IsConfirmed = @event.IsConfirmed;
            CreatedBy = @event.Createdby;
            Users = @event.EventUsers?
                        .Where(eu => eu.User != null)
                        .Select(eu => new UserDTO(eu.User))
                        .ToList();
        }
        public Guid Id { get; set; }
        public string Location { get; set; }
        public Guid LeagueId { get; set; }
        public DateTime EventTime { get; set; }
        public bool IsConfirmed { get; set; }
        public Guid CreatedBy { get; set; }
        public List<UserDTO>? Users { get; set; }
    }
}
