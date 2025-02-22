namespace leaguerAPI.Models
{
    public class Sport
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool IsTeamSport { get; set; }
        public string Description { get; set; }
    }
}
