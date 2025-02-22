namespace leaguerAPI.Models
{
    public class EventTeam
    {
        public Guid EventId { get; set; }
        public Guid TeamId { get; set; }

        public Event Event { get; set; }
        public Team Team { get; set; }
    }
}
