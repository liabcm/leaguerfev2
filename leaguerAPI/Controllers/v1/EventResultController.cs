using leaguerAPI.Extensions;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace leaguerAPI.Controllers.v1
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class EventResultController : ControllerBase
    {
        private readonly EventResultService _eventResultService;

        public EventResultController(EventResultService eventResultService)
        {
            _eventResultService = eventResultService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EventResultInputDTO eventResult)
        {
            var response = await _eventResultService.CreateAsync(eventResult, User.GetObjectId());
            if (!response.Success)
            {
                return BadRequest(new { message = response.ErrorMessage });
            }
            return Ok(response.Data);
        }

        [HttpGet("team/{teamId}")]
        public async Task<IActionResult> GetByTeamId([FromRoute] int teamId)
        {
            // TODO: Implement get by team ID logic
            return Ok();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId([FromRoute] int userId)
        {
            // TODO: Implement get by user ID logic
            return Ok();
        }

        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetByLeagueId([FromRoute] int leagueId)
        {
            // TODO: Implement get by league ID logic
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            // TODO: Implement get by ID logic
            return Ok();
        }
    }
}
