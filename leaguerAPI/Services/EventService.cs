using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class EventService : IEventService
    {
        private readonly LeaguerDbContext _context;

        public EventService(LeaguerDbContext context)
        {
            _context = context;
        }

        public async Task<Response<EventDTO>> CreateEvent(EventInputDTO eventDto, Guid userId)
        {
            try
            {
                // Validate league exists
                var league = await _context.Leagues.FirstOrDefaultAsync(l => l.Id == eventDto.LeagueId);
                if (league == null)
                {
                    return new Response<EventDTO>
                    {
                        Success = false,
                        ErrorMessage = "League not found"
                    };
                }

                // Validate user exists
                var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return new Response<EventDTO>
                    {
                        Success = false,
                        ErrorMessage = "User not found"
                    };
                }

                if (eventDto.OpponentIds.Count < 2)
                {
                    return new Response<EventDTO>
                    {
                        Success = false,
                        ErrorMessage = "Event must have at least 2 parties"
                    };
                }

                var newEvent = new Event
                {
                    Id = Guid.NewGuid(),
                    Location = eventDto.Location,
                    LeagueId = eventDto.LeagueId,
                    EventTime = eventDto.EventTime,
                    Createdby = userId
                };

                if (league.IsTeamLeague)
                {
                    newEvent.EventTeams = eventDto.OpponentIds.Select(og => new EventTeam { EventId = newEvent.Id, TeamId = og }).ToList();
                }
                else
                {
                    newEvent.EventUsers = eventDto.OpponentIds.Select(og => new EventUser { EventId = newEvent.Id, UserId = og }).ToList();
                }

                await _context.Events.AddAsync(newEvent);
                await _context.SaveChangesAsync();

                return new Response<EventDTO>
                {
                    Success = true,
                    Data = new EventDTO(newEvent)
                };
            }
            catch (Exception ex)
            {
                // Log exception here
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
                // Log exception here
                return new Response<EventDTO>
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Response<PagedResult<EventDTO>>> GetMyUpcomingEvents(Guid userId, int page, int pageSize)
        {
            var query = _context.Events.AsNoTracking().Where(e => (e.EventUsers.Any(eu => eu.UserId == userId)
                                    || e.EventTeams.Any(et => et.Team.TeamUsers.Any(tu => tu.UserId == userId
                                                                                    && (tu.Status == TeamUserStatus.Manager
                                                                                    || tu.Status == TeamUserStatus.Member))))
                                    && e.EventTime > DateTime.Now);

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
    }
}
