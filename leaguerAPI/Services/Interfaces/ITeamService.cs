using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface ITeamService
    {
        Task<Response<TeamDTO>> CreateTeamAsync(TeamCreateDTO teamDTO, Guid leagueManagerId, Guid? leagueId);
        Task<Response<TeamDTO>> UpdateTeamAsync(TeamUpdateDTO teamDTO);
        Task<Response<TeamDTO>> GetTeamByIdAsync(Guid teamId);
        Task<Response<IEnumerable<TeamDTO>>> GetTeamsByLeagueIdAsync(Guid leagueId);
        Task<Response<List<TeamDTO>>> GetMyTeamsAsync(Guid userId);
        Task<Response<bool>> InviteOrRequestToTeam(Guid teamId, Guid userId, Guid currentUserId, bool isInvite);
        Task<Response<bool>> DeclineInviteOrRequest(Guid teamId, Guid userId, Guid currentUserId);
        Task<Response<bool>> AcceptRequestOrInvite(Guid teamId, Guid userId, Guid currentUserId);
        Task<Response<bool>> LeaveTeam(Guid teamId, Guid currentUserId, Guid userIdToKick);
        Task<Response<bool>> RejectTeamCreation(Guid teamId, Guid currentUserId, Guid leagueId);
        Task<Response<List<TeamDTO>>> GetMyJoinedTeams(Guid userId);
        Task<Response<PagedResult<TeamDTO>>> SearchAsync(string searchTerm, int page, int pageSize);
    }
}
