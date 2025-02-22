namespace leaguerAPI.Models.DTOs
{
    public class TeamDTO
    {
        public TeamDTO(Team team)
        {
            Id = team.Id;
            Name = team.Name;
            Rank = team.Rank;
            Wins = team.Wins;
            Losses = team.Losses;
            TeamUsers = team.TeamUsers?
                .Where(t => t.User != null)
                .Select(t =>new UserDTO(t.User))
                .ToList();
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Rank { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }

        public List<UserDTO>? TeamUsers { get; set; }
    }
}
