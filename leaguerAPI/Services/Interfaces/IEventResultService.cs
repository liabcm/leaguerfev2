using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface IEventResultService
    {
        Task<Response<EventResultDTO>> CreateAsync(EventResultInputDTO eventResultDto, Guid currentUserId);
        Task<Response<EventResultDTO>> GetByIdAsync(int id);
        Task<Response<PagedResult<EventResultDTO>>> GetByTeamIdAsync(int teamId, int pageNumber, int pageSize);
        Task<Response<PagedResult<EventResultDTO>>> GetByUserIdAsync(int userId, int pageNumber, int pageSize);
        Task<Response<PagedResult<EventResultDTO>>> GetByLeagueIdAsync(int leagueId, int pageNumber, int pageSize);
    }
}
