using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models
{
    public class TeamUser
    {
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsManager { get; set; }
        public TeamUserStatus Status { get; set; }

        public Team Team { get; set; }
        public User User { get; set; }
    }
}
