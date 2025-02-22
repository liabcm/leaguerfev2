namespace leaguerAPI.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public ICollection<LeagueUser> LeagueUsers { get; set; }
        public ICollection<Event> Events { get; set; }
        public ICollection<EventUser> EventUsers { get; set; }
        public ICollection<TeamUser> TeamUsers { get; set; }
    }
}
