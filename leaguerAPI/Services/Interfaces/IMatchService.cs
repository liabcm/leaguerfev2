using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface IMatchService
    {
        Task<Response<List<MatchDTO>>> CreateMatches(List<CreateMatchDTO> matchDTOs, Guid eventId);
    }
}
