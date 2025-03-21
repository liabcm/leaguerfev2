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
        Task<Response<bool>> RequestToJoinEvent(Guid eventId, Guid userId);
        Task<Response<bool>> InviteToEvent(Guid eventId, Guid userId);
        Task<Response<bool>> LeaveEvent(Guid eventId, Guid userId);
    }
}
