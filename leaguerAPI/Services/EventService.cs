using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Models.Enums;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class EventService : IEventService
    {
        private readonly LeaguerDbContext _context;
        private IMatchService _matchService;

        public EventService(LeaguerDbContext context, IMatchService matchService)
        {
            _context = context;
            _matchService = matchService;
        }

        public async Task<Response<EventDTO>> CreateEvent(EventInputDTO eventDto, Guid userId)
        {
            try
            {
                return await CreateEventEntity(eventDto, userId);
            }
            catch (Exception ex)
            {
                return new Response<EventDTO>
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Response<EventDTO>> GetEventById(Guid eventId)
        {
            try
            {
                var eventEntity = await _context.Events.Include(e => e.EventUsers)
                                                            .ThenInclude(eu => eu.User)
                                                        .Include(e => e.EventTeams)
                                                            .ThenInclude(et => et.Team)
                                                       .FirstOrDefaultAsync(e => e.Id == eventId);

                if (eventEntity == null)
                {
                    return new Response<EventDTO>
                    {
                        Success = false,
                        ErrorMessage = "Event not found"
                    };
                }

                return new Response<EventDTO>
                {
                    Success = true,
                    Data = new EventDTO(eventEntity)
                };
            }
            catch (Exception ex)
            {
                return new Response<EventDTO>
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Response<PagedResult<EventDTO>>> GetJoinableEvents(Guid userId, int page, int pageSize, bool inMyLeagues)
        {
            var query = _context.Events.AsNoTracking()
                    .Where(e => e.EventTime > DateTime.UtcNow
                    && (e.JoinType == EventJoinType.Request || e.JoinType == EventJoinType.Open));
            if (inMyLeagues)
            {
                query = query
                    .Where(e => e.League.LeagueUsers.Any(lu => lu.UserId == userId));
            }
            var totalCount = await query.CountAsync();
            var events = await query.OrderBy(e => e.EventTime)
                                    .Skip((page - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            return Response<PagedResult<EventDTO>>.SuccessResult(new PagedResult<EventDTO>
            {
                Items = events.Select(e => new EventDTO(e)),
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            });

        }

        public async Task<Response<PagedResult<EventDTO>>> GetMyUpcomingEvents(Guid userId, int page, int pageSize)
        {
            var query = _context.Events.AsNoTracking().Where(e => (e.EventUsers.Any(eu => eu.UserId == userId)
                                    || e.EventTeams.Any(et => et.Team.TeamUsers.Any(tu => tu.UserId == userId
                                                                                    && (tu.Status == TeamUserStatus.Member))))
                                    && e.EventTime > DateTime.UtcNow);

            var totalCount = await query.CountAsync();

            var events = await query.OrderBy(e => e.EventTime)
                                    .Skip((page - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            return Response<PagedResult<EventDTO>>.SuccessResult(new PagedResult<EventDTO>
            {
                Items = events.Select(e => new EventDTO(e)),
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            });
        }

        public Task<Response<bool>> InviteToEvent(Guid eventId, Guid userId)
        {
            throw new NotImplementedException();
        }

        public Task<Response<bool>> JoinEvent(Guid eventId, Guid userId)
        {
            throw new NotImplementedException();
        }

        public Task<Response<bool>> LeaveEvent(Guid eventId, Guid userId)
        {
            throw new NotImplementedException();
        }

        public Task<Response<bool>> RequestToJoinEvent(Guid eventId, Guid userId)
        {
            throw new NotImplementedException();
        }

        private async Task<Response<EventDTO>> CreateEventEntity(EventInputDTO eventDto, Guid userId)
        {
            var newEvent = new Event
            {
                Id = Guid.NewGuid(),
                Location = eventDto.Location,
                LeagueId = eventDto.LeagueId ?? null,
                EventTime = eventDto.EventTime,
                Createdby = userId,
                JoinType = eventDto.JoinType,
                EventType = eventDto.EventType,
                MaxParticipants = eventDto.MaxParticipants,
                IsTeamEvent = eventDto.IsTeamEvent
            };

            if (eventDto.IsTeamEvent && eventDto.EventType != EventType.FreePlay)//Free play is structureless so we dont really care about teams only users
            {
                newEvent.EventTeams = eventDto.OpponentIds.Select(og => new EventTeam { EventId = newEvent.Id, TeamId = og }).ToList();
            }
            else
            {
                newEvent.EventUsers = eventDto.OpponentIds.Select(og => new EventUser { EventId = newEvent.Id, UserId = og }).ToList();
            }

            await _context.Events.AddAsync(newEvent);
            await _context.SaveChangesAsync();

            if (eventDto.CreateMatchDTOs != null && eventDto.CreateMatchDTOs.Count > 0)
            {
                var matchResult = await _matchService.CreateMatches(eventDto.CreateMatchDTOs, newEvent.Id);
                if (!matchResult.Success)
                {
                    return Response<EventDTO>.FailureResult(matchResult.ErrorMessage!);
                }
            }

            return new Response<EventDTO>
            {
                Success = true,
                Data = new EventDTO(newEvent)
            };
        }


    }
}
