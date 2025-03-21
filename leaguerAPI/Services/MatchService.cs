using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;

namespace leaguerAPI.Services
{
    public class MatchService : IMatchService
    {
        private readonly LeaguerDbContext _context;

        public MatchService(LeaguerDbContext context)
        {
            _context = context;
        }
        public async Task<Response<List<MatchDTO>>> CreateMatches(List<CreateMatchDTO> matchDTOs, Guid eventId)
        {
            try
            {
                var entities = matchDTOs.Select(m => new Match
                {
                    Id = Guid.NewGuid(),
                    EventId = eventId,
                    Opponent1Id = m.Opponent1Id,
                    Opponent2Id = m.Opponent2Id,
                    MatchNumber = m.MatchNumber,
                    Round = m.Round
                }).ToList();

                await _context.AddRangeAsync(entities);

                await _context.SaveChangesAsync();

                var dtos = entities.Select(m => new MatchDTO
                {
                    Id = m.Id,
                    EventId = m.EventId,
                    Opponent1Id = m.Opponent1Id,
                    Opponent2Id = m.Opponent2Id,
                    MatchNumber = m.MatchNumber,
                    Round = m.Round
                }).ToList();

                return Response<List<MatchDTO>>.SuccessResult(dtos);
            }
            catch (Exception ex)
            {
                return Response<List<MatchDTO>>.FailureResult(ex.Message);
            }
        }
    }
}
