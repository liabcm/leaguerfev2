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

        [HttpGet("my-managed-events")]
        public async Task<IActionResult> GetMyManagedEvents(string? searchTerm, int page = 1, int pageSize = 10)
        {
            var events = await _eventService.GetMyManagedEvents(searchTerm, page, pageSize, User.GetObjectId());
            return Ok(events);
        }

        [HttpPost("invite-request")]
        public async Task<IActionResult> InviteUser([FromQuery] Guid eventId, [FromQuery] Guid userId, [FromQuery] bool isInvite)
        {
            var currentUserId = User.GetObjectId();
            var result = await _eventService.InviteUserToEventAsync(eventId, userId, currentUserId, isInvite);

            if (!result.Success)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpPost("decline")]
        public async Task<IActionResult> DeclineInvite([FromBody] InviteRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(Response<bool>.FailureResult("Invalid request data"));
            }
            var userId = User.GetObjectId();

            var response = await _eventService.DeclineEventInviteAsync(request.LeagueId, request.UserId, userId);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpPost("accept")]
        public async Task<IActionResult> AcceptInvite(Guid eventId, Guid userId)
        {
            // Basic GUID validation
            if (eventId == Guid.Empty || userId == Guid.Empty)
            {
                return BadRequest(Response<bool>.FailureResult("LeagueId and UserId must be valid GUIDs."));
            }

            var result = await _eventService.AcceptEventInviteAsync(eventId, userId, User.GetObjectId());

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}
