using leaguerAPI.Models.DTOs;

namespace leaguerAPI.Services.Interfaces
{
    public interface IEventService
    {
        Task<Response<EventDTO>> CreateEvent(EventInputDTO eventDto, Guid userId);
        Task<Response<EventDTO>> GetEventById(Guid eventId);
        Task<Response<PagedResult<EventDTO>>> GetMyUpcomingEvents(Guid userId, int page, int pageSize);
    }
}
