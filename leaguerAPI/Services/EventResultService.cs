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
                if (eventResultDto?.WinningId == null)
                {
                    return Response<EventResultDTO>.FailureResult("Winner is required");
                }

                var existingEvent = await _context.Events
                                                    .Include(e => e.League)
                                                        .ThenInclude(l => l.LeagueUsers)
                                                    .Include(e => e.EventTeams)
                                                    .FirstOrDefaultAsync(x => x.Id == eventResultDto.EventId);
                if (existingEvent == null)
                {
                    return Response<EventResultDTO>.FailureResult("No event found");
                }

                var canAdd = existingEvent.League.LeagueUsers.Any(x => x.UserId == currentUserId && x.IsManager);
                if (!canAdd)
                {
                    return Response<EventResultDTO>.FailureResult("You are not allowed to add result");
                }
                var eventResult = new EventResult();

                if (existingEvent.League.IsTeamLeague)
                {
                    var winningTeam = await _context.Teams.FirstOrDefaultAsync(u => u.Id == eventResultDto.WinningId);
                    var losingTeam = await _context.Teams.FirstOrDefaultAsync(u => u.Id == eventResultDto.LosingId);

                    if (winningTeam == null)
                    {
                        return Response<EventResultDTO>.FailureResult("Winner team not found");
                    }
                    if (losingTeam == null)
                    {
                        return Response<EventResultDTO>.FailureResult("Loser team not found");
                    }
                    winningTeam.Wins++;
                    losingTeam.Losses++;

                    eventResult.WinningTeamId = eventResultDto.WinningId;
                    eventResult.LosingTeamId = eventResultDto.LosingId;
                }
                else
                {
                    eventResult.WinningUserId = eventResultDto.WinningId;
                }

                eventResult.EventId = eventResultDto.EventId;
                eventResult.Score = eventResultDto.Score;
                eventResult.StarPlayerUserId = eventResultDto.StarPlayerUserId;


                var eventAdded = await _context.EventResults.AddAsync(eventResult);
                var eventCreated = eventAdded.Entity;
                await _context.SaveChangesAsync();
                return Response<EventResultDTO>.SuccessResult(new EventResultDTO
                {
                    Id = eventCreated.Id,
                    Event = new EventDTO
                    {
                        Location = eventCreated.Event.Location,
                        EventTime = eventCreated.Event.EventTime,
                    },
                    Score = eventCreated.Score,
                    StarPlayerUserId = eventCreated.StarPlayerUserId,
                    WinningTeam = eventCreated.WinningTeam != null ? new TeamDTO { Name = eventCreated.WinningTeam.Name } : null,
                    LosingTeam = eventCreated.LosingTeam != null ? new TeamDTO { Name = eventCreated.LosingTeam.Name } : null,
                    WinningUser = eventCreated.WinningUser != null ? new UserDTO { Name = eventCreated.WinningUser.Name } : null,
                    LosingUser = eventCreated.LosingUser != null ? new UserDTO { Name = eventCreated.LosingUser.Name } : null,
                });
            }
            catch (Exception ex)
            {
                return Response<EventResultDTO>.FailureResult(ex.Message);
            }
        }

        public async Task<Response<EventResultDTO>> GetByIdAsync(Guid id)
        {
            try
            {
                var eventResult = await _context.EventResults.Select(er => new EventResultDTO
                {
                    Id = er.Id,
                    Event = new EventDTO
                    {
                        Location = er.Event.Location,
                        EventTime = er.Event.EventTime,
                    },
                    Score = er.Score,
                    StarPlayerUser = er.StarPlayerUser,
                    WinningTeam = er.WinningTeam != null ? new TeamDTO { Name = er.WinningTeam.Name } : null,
                    LosingTeam = er.LosingTeam != null ? new TeamDTO { Name = er.LosingTeam.Name } : null,
                    WinningUser = er.WinningUser != null ? new UserDTO { Name = er.WinningUser.Name } : null,
                    LosingUser = er.LosingUser != null ? new UserDTO { Name = er.LosingUser.Name } : null,
                }).FirstOrDefaultAsync(er => er.Id == id);

                if (eventResult == null)
                {
                    return Response<EventResultDTO>.FailureResult("Event result not found");
                }
                return Response<EventResultDTO>.SuccessResult(eventResult);
            }
            catch (Exception ex)
            {
                return Response<EventResultDTO>.FailureResult(ex.Message);
            }
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
