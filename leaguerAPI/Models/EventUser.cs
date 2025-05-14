using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models
{
    public class EventUser
    {
        public Guid UserId { get; set; }
        public Guid EventId { get; set; }
        public EventUserStatus Status { get; set; }

        public User User { get; set; }
        public Event Event { get; set; }
    }
}
