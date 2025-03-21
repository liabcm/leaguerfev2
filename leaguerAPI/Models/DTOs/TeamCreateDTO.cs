namespace leaguerAPI.Models.DTOs
{
    public class TeamCreateDTO
    {
        public List<Guid> TeamManagerIds { get; set; }
        public string Name { get; set; }
        public List<Guid>? TeamUserIds { get; set; }
    }
}
