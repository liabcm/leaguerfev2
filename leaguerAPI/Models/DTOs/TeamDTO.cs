using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models.DTOs
{
    public class TeamDTO
    {
        public TeamDTO()
        {

        }
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
            TeamInvites = team.TeamUsers?
                .Where(t => t.Status == TeamUserStatus.Invited)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            TeamRequests = team.TeamUsers?
                .Where(t => t.Status == TeamUserStatus.Requested)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            TeamCreateRequests = team.TeamUsers?
                .Where(t => t.Status == TeamUserStatus.TeamRequested)
                .Select(t => new TeamUserDTO(t))
                .ToList();
            IsPending = team.IsPending;
            EventTeams = team.EventTeams?.Select(et => new EventTeamDTO(et)).ToList();
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public bool IsPending { get; set; }

        public List<TeamUserDTO>? TeamUsers { get; set; }
        public List<TeamUserDTO>? TeamInvites { get; set; }
        public List<TeamUserDTO>? TeamRequests { get; set; }
        public List<TeamUserDTO>? TeamCreateRequests { get; set; }
        public List<EventTeamDTO>? EventTeams { get; set; }
    }
}
