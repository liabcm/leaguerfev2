using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class SportService : ISportService
    {
        private readonly LeaguerDbContext _context;

        public SportService(LeaguerDbContext context)
        {
            _context = context;
        }

        public async Task<Sport> CreateSportAsync(Sport sport)
        {
            sport.Id = Guid.NewGuid();
            await _context.Sports.AddAsync(sport);
            await _context.SaveChangesAsync();
            return sport;
        }

        public async Task<List<Sport>> GetAllSportsAsync()
        {
            return await _context.Sports.AsNoTracking().ToListAsync();
        }
    }
}
