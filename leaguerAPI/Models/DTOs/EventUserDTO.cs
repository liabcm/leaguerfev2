namespace leaguerAPI.Models.DTOs
{
    public class EventUserDTO
    {
        public EventUserDTO(EventUser eventUser)
        {
            UserId = eventUser.UserId;
            EventId = eventUser.EventId;
            Name = eventUser.User?.Name;
            Email = eventUser.User?.Email;
        }
        public Guid UserId { get; set; }
        public Guid EventId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
    }
}
