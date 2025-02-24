namespace leaguerAPI.Models.DTOs
{
    public class TeamUpdateDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Guid>? TeamUserIds { get; set; }
        public List<Guid> TeamManagerIds { get; set; }

    }
}
