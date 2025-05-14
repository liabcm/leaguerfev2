using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface IEventService
    {
        Task<Response<EventDTO>> CreateEvent(EventInputDTO eventDto, Guid userId);
        Task<Response<EventDTO>> GetEventById(Guid eventId);
        Task<Response<PagedResult<EventDTO>>> GetMyUpcomingEvents(Guid userId, int page, int pageSize);
        Task<Response<PagedResult<EventDTO>>> GetJoinableEvents(Guid userId, int page, int pageSize, bool inMyLeagues);
        Task<Response<bool>> JoinEvent(Guid eventId, Guid userId);
        Task<Response<bool>> LeaveEvent(Guid eventId, Guid userId);
        Task<PagedResult<EventDTO>> GetMyManagedEvents(string? searchTerm, int page, int pageSize, Guid userId);
        Task<Response<bool>> InviteUserToEventAsync(Guid eventId, Guid invitedUserId, Guid currentUserId, bool isInvite);
        Task<Response<bool>> DeclineEventInviteAsync(Guid eventId, Guid userId, Guid currentUserId);
        Task<Response<bool>> AcceptEventInviteAsync(Guid eventId, Guid userId, Guid currentUserId);
    }
}
