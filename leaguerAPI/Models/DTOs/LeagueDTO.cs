namespace leaguerAPI.Models.DTOs
{
    public class LeagueDTO
    {
        public LeagueDTO()
        {

        }
        public LeagueDTO(League league)
        {
            Id = league.Id;
            Name = league.Name;
            Sport = league.Sport;
            CreatedDate = league.CreatedDate;
            ModifiedDate = league.ModifiedDate;
            isPublic = league.isPublic;
            isCompetitive = league.isCompetitive;
            CreatedBy = league.CreatedBy;
            IsTeamLeague = league.IsTeamLeague;
            LeagueMembers = league.LeagueUsers?.Where(lu => lu.Status == LeagueUserStatus.Member || lu.Status == LeagueUserStatus.Manager).Select(l => new LeagueUserDTO(l)).ToList();
            LeagueInvites = league.LeagueUsers?.Where(lu => lu.Status == LeagueUserStatus.Invited).Select(l => new LeagueUserDTO(l)).ToList();
            LeagueRequests = league.LeagueUsers?.Where(lu => lu.Status == LeagueUserStatus.Requested).Select(l => new LeagueUserDTO(l)).ToList();
            Events = league.Events?.Select(e => new EventDTO(e)).ToList();
            Teams = league.Teams?.Where(t => !t.IsPending).Select(t => new TeamDTO(t)).ToList();
            TeamRequests = league.Teams?.Where(t => t.IsPending).Select(t => new TeamDTO(t)).ToList();
        }
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sport { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool isPublic { get; set; }
        public bool isCompetitive { get; set; }
        public Guid CreatedBy { get; set; }
        public bool IsTeamLeague { get; set; }
        public List<LeagueUserDTO>? LeagueMembers { get; set; }
        public List<LeagueUserDTO>? LeagueInvites { get; set; }
        public List<LeagueUserDTO>? LeagueRequests { get; set; }
        public List<EventDTO>? Events { get; set; }
        public List<TeamDTO>? Teams { get; set; }
        public List<TeamDTO>? TeamRequests { get; set; }
    }
}
