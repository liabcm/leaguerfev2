using leaguerAPI.Models;

namespace leaguerAPI.Services.Interfaces
{
    public interface ISportService
    {
        Task<Sport> CreateSportAsync(Sport sport);
        Task<List<Sport>> GetAllSportsAsync();
    }
}
