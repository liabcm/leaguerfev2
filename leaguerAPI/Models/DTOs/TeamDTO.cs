namespace leaguerAPI.Models.DTOs
{
    public class TeamDTO
    {
        public TeamDTO(Team team)
        {
            Id = team.Id;
            Name = team.Name;
            Wins = team.Wins;
            Losses = team.Losses;
            TeamUsers = team.TeamUsers?
                .Where(t => !t.IsManager)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            TeamManagers = team.TeamUsers?
                .Where(t => t.IsManager)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            Rank = team.League?.Teams?
                .OrderBy(t => (decimal)t.Wins / (decimal)t.Losses)
                .ToList()
                .FindIndex(t => t.Id == team.Id) + 1 ?? 0;
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Rank { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }

        public List<TeamUserDTO>? TeamUsers { get; set; }
        public List<TeamUserDTO>? TeamManagers { get; set; }
    }
}
