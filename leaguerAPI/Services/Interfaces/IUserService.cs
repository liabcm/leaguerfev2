using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(CreateUserDTO user);
        Task<User> GetByIdAsync(Guid id);
        Task<Response<PagedResult<UserDTO>>> SearchUsersToInviteAsync(Guid LeagueId, string searchTerm, int page, int pageSize);
        Task<Response<List<LeagueUserDTO>>> GetCurrentUserInvitesAsync(Guid userId);
        Task<Response<bool>> DeclineInviteAsync(Guid leagueId, Guid userId, Guid currentUserId);
        Task<Response<bool>> AcceptInviteAsync(Guid leagueId, Guid userId, Guid currentUserId);
        Task<Response<PagedResult<UserDTO>>> SearchUsersToInviteTeamsAsync(Guid teamId, string searchTerm, int page, int pageSize);
        Task<Response<List<TeamUserDTO>>> GetCurrentUserTeamInvitesAndRequests(Guid userId);

    }
}
