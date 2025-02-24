using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface ITeamService
    {
        Task<Response<TeamDTO>> CreateTeamAsync(TeamCreateDTO teamDTO, Guid leagueManagerId);
        Task<Response<TeamDTO>> UpdateTeamAsync(TeamUpdateDTO teamDTO);
        Task<Response<TeamDTO>> GetTeamByIdAsync(Guid teamId);
        Task<Response<IEnumerable<TeamDTO>>> GetTeamsByLeagueIdAsync(Guid leagueId);
    }
}
