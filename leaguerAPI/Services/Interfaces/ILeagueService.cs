using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface ILeagueService
    {
        Task<Response<LeagueDTO>> CreateAsync(LeagueInputDTO request, Guid userId);
        Task<bool> UpdateAsync(LeagueInputDTO request);
        Task<LeagueDTO?> GetByIdAsync(Guid id);
        Task<PagedResult<LeagueDTO>> GetAllAsync(string? searchTerm, int page, int pageSize);
        Task<Response<bool>> JoinLeague(Guid leagueId, Guid userId);
        Task<Response<bool>> LeaveLeague(Guid leagueId, Guid userId, bool kicking, Guid? managerId);
        Task<Response<List<LeagueDTO>>> GetMyLeaguesAsync(Guid userId);
        Task<Response<List<LeagueDTO>>> GetJoinedLeaguesAsync(Guid userId);
        Task<Response<bool>> InviteUserToLeagueAsync(Guid leagueId, Guid invitedUserId, Guid currentUserId, bool isInvite);
        Task<Response<bool>> DeleteAsync(Guid leagueId, Guid currentUserId);

    }
}
