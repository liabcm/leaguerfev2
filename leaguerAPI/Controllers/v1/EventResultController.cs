using leaguerAPI.Extensions;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace leaguerAPI.Controllers.v1
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class EventResultController : ControllerBase
    {
        private readonly IEventResultService _eventResultService;

        public EventResultController(IEventResultService eventResultService)
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
        public async Task<IActionResult> GetById(Guid id)
        {
            var response = await _eventResultService.GetByIdAsync(id);
            if (!response.Success)
            {
                return BadRequest(new { message = response.ErrorMessage });
            }
            return Ok(response.Data);
        }
    }
}
