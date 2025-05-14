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
                                                            .ThenInclude(t => t.TeamUsers)
                                                            .ThenInclude(tu => tu.User)
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

            if (eventDto.LeagueId.HasValue)
            {
                var league = await _context.Leagues.FirstOrDefaultAsync(l => l.Id == eventDto.LeagueId);
                if (league == null)
                {
                    return Response<EventDTO>.FailureResult("League not found");
                }
                newEvent.League = league;


                if (eventDto.IsTeamEvent && eventDto.EventType != EventType.FreePlay)//Free play is structureless so we dont really care about teams only users
                {
                    newEvent.EventTeams = eventDto.OpponentIds.Select(og => new EventTeam { EventId = newEvent.Id, TeamId = og }).ToList();
                }
                else
                {
                    newEvent.EventUsers = eventDto.OpponentIds.Select(og => new EventUser { EventId = newEvent.Id, UserId = og }).ToList();
                }
            }

            await _context.Events.AddAsync(newEvent);
            await _context.SaveChangesAsync();

            //if (eventDto.CreateMatchDTOs != null && eventDto.CreateMatchDTOs.Count > 0)
            //{
            //    var matchResult = await _matchService.CreateMatches(eventDto.CreateMatchDTOs, newEvent.Id);
            //    if (!matchResult.Success)
            //    {
            //        return Response<EventDTO>.FailureResult(matchResult.ErrorMessage!);
            //    }
            //}

            return new Response<EventDTO>
            {
                Success = true,
                Data = new EventDTO(newEvent)
            };
        }

        public async Task<PagedResult<EventDTO>> GetMyManagedEvents(string? searchTerm, int page, int pageSize, Guid userId)
        {
            var query = _context.Events.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(e =>
                    e.Location.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .AsNoTracking()
                .Where(e => e.Createdby == userId)
                .OrderByDescending(l => l.EventTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<EventDTO>
            {
                Items = items.Select(l => new EventDTO(l)),
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<Response<bool>> InviteUserToEventAsync(Guid eventId, Guid invitedUserId, Guid currentUserId, bool isInvite)
        {
            // Check if current user is the event creator (only for invites)
            if (isInvite)
            {
                var isCreator = await _context.Events
                    .AnyAsync(e => e.Id == eventId && e.Createdby == currentUserId);

                if (!isCreator)
                {
                    return Response<bool>.FailureResult("User is not authorized to invite members to this event");
                }
            }

            // Retrieve the event
            var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.Id == eventId);
            if (eventEntity == null)
            {
                return Response<bool>.FailureResult("Event not found");
            }

            if (eventEntity.JoinType == EventJoinType.AddOnly)
            {
                return Response<bool>.FailureResult("User cannot request to join or invite add only events");
            }

            // Check event join type restrictions
            if (eventEntity.JoinType == EventJoinType.InviteOnly && !isInvite)
            {
                return Response<bool>.FailureResult("User cannot request to join invite only events");
            }

            // Check if event has reached max participants
            var currentParticipantsCount = await _context.EventUsers
                .CountAsync(eu => eu.EventId == eventId && eu.Status == EventUserStatus.Member);

            if (currentParticipantsCount >= eventEntity.MaxParticipants)
            {
                return Response<bool>.FailureResult("Event has reached maximum number of participants");
            }

            // Check for existing record for the user-event pair
            var existingRecord = await _context.EventUsers.IgnoreQueryFilters()
                .FirstOrDefaultAsync(eu => eu.EventId == eventId && eu.UserId == invitedUserId);

            if (existingRecord != null)
            {
                if (existingRecord.Status == EventUserStatus.Member)
                {
                    return Response<bool>.FailureResult("User is already a member of this event");
                }
                else if (existingRecord.Status == EventUserStatus.Invited || existingRecord.Status == EventUserStatus.Requested)
                {
                    return Response<bool>.FailureResult("User has already been invited or has a pending request");
                }
            }
            else
            {
                // Create a new record
                var newRecord = new EventUser
                {
                    EventId = eventId,
                    UserId = invitedUserId,
                    Status = isInvite ? EventUserStatus.Invited : EventUserStatus.Requested,
                };
                await _context.EventUsers.AddAsync(newRecord);
            }

            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<bool>> DeclineEventInviteAsync(Guid eventId, Guid userId, Guid currentUserId)
        {
            if (eventId == Guid.Empty || userId == Guid.Empty || currentUserId == Guid.Empty)
            {
                return Response<bool>.FailureResult("Invalid EventId or UserId.");
            }

            // Check if the current user is the event creator or the invited user
            var isCreatorOrInvitedUser = await _context.Events
                .AnyAsync(e => e.Id == eventId &&
                               (e.Createdby == currentUserId || userId == currentUserId));

            if (!isCreatorOrInvitedUser)
            {
                return Response<bool>.FailureResult("You do not have permission to decline this invite.");
            }

            var record = await _context.EventUsers
                .FirstOrDefaultAsync(eu => eu.EventId == eventId && eu.UserId == userId);

            if (record == null)
            {
                return Response<bool>.FailureResult("Invite not found");
            }

            _context.Remove(record);
            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<bool>> AcceptEventInviteAsync(Guid eventId, Guid userId, Guid currentUserId)
        {
            if (eventId == Guid.Empty || userId == Guid.Empty || currentUserId == Guid.Empty)
            {
                return Response<bool>.FailureResult("Invalid EventId or UserId.");
            }

            // Verify current user is either the invited user or the event creator
            var isCreatorOrInvitedUser = await _context.Events
                .AnyAsync(e => e.Id == eventId &&
                               (e.Createdby == currentUserId || userId == currentUserId));

            if (!isCreatorOrInvitedUser)
            {
                return Response<bool>.FailureResult("You do not have permission to accept this invite.");
            }

            // Check for existing record
            var record = await _context.EventUsers
                .FirstOrDefaultAsync(eu => eu.EventId == eventId && eu.UserId == userId);

            if (record == null)
            {
                return Response<bool>.FailureResult("Invite not found or already accepted.");
            }

            // Prevent self-accepting requests
            if (record.Status == EventUserStatus.Requested && userId == currentUserId)
            {
                return Response<bool>.FailureResult("User cannot accept own request");
            }

            // Prevent others from accepting invites on behalf of users
            if (record.Status == EventUserStatus.Invited && userId != currentUserId)
            {
                return Response<bool>.FailureResult("Cannot accept invite for another user");
            }

            // Check max participants again before accepting
            var currentParticipantsCount = await _context.EventUsers
                .CountAsync(eu => eu.EventId == eventId && eu.Status == EventUserStatus.Member);

            var eventEntity = await _context.Events.FirstOrDefaultAsync(e => e.Id == eventId);
            if (currentParticipantsCount >= eventEntity.MaxParticipants)
            {
                return Response<bool>.FailureResult("Event has reached maximum number of participants");
            }

            // Update status to Member
            record.Status = EventUserStatus.Member;
            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public Task<Response<bool>> JoinEvent(Guid eventId, Guid userId)
        {
            throw new NotImplementedException();
        }

        public Task<Response<bool>> LeaveEvent(Guid eventId, Guid userId)
        {
            throw new NotImplementedException();
        }
    }
}
