using leaguerAPI.Models.Enums;

namespace leaguerAPI.Models
{
    public class LeagueUser
    {
        public Guid UserId { get; set; }
        public Guid LeagueId { get; set; }
        public LeagueUserStatus Status { get; set; }
        public League League { get; set; }
        public User User { get; set; }
        public bool IsManager { get; set; }
    }
}
