using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class EventResultService : IEventResultService
    {
        private readonly LeaguerDbContext _context;

        public EventResultService(LeaguerDbContext context)
        {
            _context = context;
        }
        public async Task<Response<EventResultDTO>> CreateAsync(EventResultInputDTO eventResultDto, Guid currentUserId)
        {
            try
            {
                if (eventResultDto.WinningUserId == null && eventResultDto.WinningTeamId == null)
                {
                    return Response<EventResultDTO>.FailureResult("Winner is required");
                }

                var existingEvent = await _context.Events
                                                    .Include(e => e.League)
                                                        .ThenInclude(l => l.LeagueUsers)
                                                    .FirstOrDefaultAsync(x => x.Id == eventResultDto.EventId);
                if (existingEvent == null)
                {
                    return Response<EventResultDTO>.FailureResult("No event found");
                }

                var canAdd = existingEvent.League.LeagueUsers.Any(x => x.UserId == currentUserId && x.Status == LeagueUserStatus.Manager);
                if (!canAdd)
                {
                    return Response<EventResultDTO>.FailureResult("You are not allowed to add result");
                }

                if (eventResultDto.WinningTeamId != null)
                {
                    var winningTeam = await _context.Teams.FirstOrDefaultAsync(u => u.Id == eventResultDto.WinningTeamId);
                    if (winningTeam == null)
                    {
                        return Response<EventResultDTO>.FailureResult("Winner team not found");
                    }
                    winningTeam.Wins++;
                }

                var eventResult = new EventResult
                {
                    EventId = eventResultDto.EventId,
                    WinningUserId = eventResultDto.WinningUserId,
                    WinningTeamId = eventResultDto.WinningTeamId,
                    Score = eventResultDto.Score
                };

                var eventCreated = await _context.EventResults.AddAsync(eventResult);
                await _context.SaveChangesAsync();
                return Response<EventResultDTO>.SuccessResult(new EventResultDTO(eventCreated.Entity));
            }
            catch (Exception ex)
            {
                return Response<EventResultDTO>.FailureResult(ex.Message);
            }
        }

        public Task<Response<EventResultDTO>> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Response<PagedResult<EventResultDTO>>> GetByLeagueIdAsync(int leagueId, int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<Response<PagedResult<EventResultDTO>>> GetByTeamIdAsync(int teamId, int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<Response<PagedResult<EventResultDTO>>> GetByUserIdAsync(int userId, int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }
    }
}
