using leaguerAPI.Extensions;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace leaguerAPI.Controllers.v1
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventInputDTO eventDto)
        {
            var userId = User.GetObjectId();
            var result = await _eventService.CreateEvent(eventDto, userId);

            if (!result.Success)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return CreatedAtAction(nameof(CreateEvent), new { id = result.Data.Id }, result.Data);
        }

        [HttpGet("my-upcoming")]
        public async Task<IActionResult> GetMyUpcomingEvents(int page, int pageSize)
        {
            var userId = User.GetObjectId();
            var result = await _eventService.GetMyUpcomingEvents(userId, page, pageSize);
            if (!result.Success)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }
            return Ok(result.Data);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetEventAsync(Guid id)
        {
            var response = await _eventService.GetEventById(id);
            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }
            return Ok(response.Data);
        }
    }
}
