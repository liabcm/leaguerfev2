using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models.DTOs
{
    public class TeamUserDTO
    {
        public TeamUserDTO(TeamUser teamUser)
        {
            UserId = teamUser.UserId;
            TeamId = teamUser.TeamId;
            TeamName = teamUser.Team?.Name;
            Name = teamUser.User?.Name;
            Email = teamUser.User?.Email;
            Status = teamUser.Status;
            IsManager = teamUser.IsManager;
        }
        public Guid UserId { get; set; }
        public Guid TeamId { get; set; }
        public string? TeamName { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public TeamUserStatus Status { get; set; }
        public bool IsManager { get; set; }
    }
}
