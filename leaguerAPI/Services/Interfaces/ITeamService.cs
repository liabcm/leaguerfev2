using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface ITeamService
    {
        Task<Response<TeamDTO>> CreateTeamAsync(TeamCreateDTO teamDTO, Guid leagueManagerId);
        Task<Response<TeamDTO>> UpdateTeamAsync(TeamUpdateDTO teamDTO);
        Task<Response<TeamDTO>> GetTeamByIdAsync(Guid teamId);
        Task<Response<IEnumerable<TeamDTO>>> GetTeamsByLeagueIdAsync(Guid leagueId);
        Task<Response<TeamDTO>> RequestTeamCreation(TeamRequestDTO teamDTO, Guid userId);
        Task<Response<TeamDTO>> AcceptTeamRequest(Guid teamId, Guid managerId);
        Task<Response<List<TeamDTO>>> GetMyTeamsAsync(Guid userId);
        Task<Response<bool>> InviteOrRequestToTeam(Guid teamId, Guid userId, Guid currentUserId, bool isInvite);
        Task<Response<bool>> DeclineInviteOrRequest(Guid teamId, Guid userId, Guid currentUserId);
        Task<Response<bool>> AcceptRequestOrInvite(Guid teamId, Guid userId, Guid currentUserId);
    }
}
