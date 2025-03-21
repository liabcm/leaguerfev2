namespace leaguerAPI.Models.DTOs
{
    public class LeagueUserDTO
    {
        public LeagueUserDTO()
        {
        }
        public LeagueUserDTO(LeagueUser leagueUser)
        {
            UserId = leagueUser.UserId;
            LeagueId = leagueUser.LeagueId;
            LeagueName = leagueUser.League.Name;
            Name = leagueUser.User?.Name;
            Email = leagueUser.User?.Email;
            Status = ((int)leagueUser.Status);
            IsManager = leagueUser.IsManager;
        }
        public Guid UserId { get; set; }
        public Guid LeagueId { get; set; }
        public string LeagueName { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public bool IsManager { get; set; }
        public int Status { get; set; }
    }
}
