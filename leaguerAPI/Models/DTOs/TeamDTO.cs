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
                .Where(t => t.Status == TeamUserStatus.Member)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            TeamManagers = team.TeamUsers?
                .Where(t => t.Status == TeamUserStatus.Manager)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            TeamInvites = team.TeamUsers?
                .Where(t => t.Status == TeamUserStatus.Invited)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            TeamRequests = team.TeamUsers?
                .Where(t => t.Status == TeamUserStatus.Requested)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            Rank = team.League?.Teams?
                .OrderBy(t => (t.Wins + t.Losses) == 0 ? decimal.MinValue : (decimal)t.Wins / (t.Wins + t.Losses))
                .ToList()
                .FindIndex(t => t.Id == team.Id) + 1 ?? 0;
            IsPending = team.IsPending;
            EventTeams = team.EventTeams?.Select(et => new EventTeamDTO(et)).ToList();
            LeagueName = team.League?.Name;

        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Rank { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public bool IsPending { get; set; }
        public string? LeagueName { get; set; }

        public List<TeamUserDTO>? TeamUsers { get; set; }
        public List<TeamUserDTO>? TeamManagers { get; set; }
        public List<TeamUserDTO>? TeamInvites { get; set; }
        public List<TeamUserDTO>? TeamRequests { get; set; }
        public List<EventTeamDTO>? EventTeams { get; set; }
    }
}
