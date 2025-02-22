namespace leaguerAPI.Models.DTOs
{
    public class UserInviteDTO
    {
        public UserInviteDTO(LeagueUser userInvite)
        {
            LeagueId = userInvite.LeagueId;
            UserId = userInvite.UserId;
            League = new LeagueDTO(userInvite.League);
        }
        public Guid LeagueId { get; set; }
        public Guid UserId { get; set; }
        public LeagueDTO League { get; set; }
    }
}
