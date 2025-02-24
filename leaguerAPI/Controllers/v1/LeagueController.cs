using leaguerAPI.Extensions;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace leaguerAPI.Controllers.v1
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class LeagueController : ControllerBase
    {
        private readonly ILeagueService _leagueService;

        public LeagueController(ILeagueService leagueService)
        {
            _leagueService = leagueService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeague([FromBody] LeagueInputDTO request)
        {
            var userId = User.GetObjectId();
            var response = await _leagueService.CreateAsync(request, userId);
            if (!string.IsNullOrEmpty(response.ErrorMessage))
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetLeague), new { id = response.Data?.Id }, response.Data);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLeague([FromBody] LeagueInputDTO request)
        {
            var reponse = await _leagueService.UpdateAsync(request);
            return reponse ? Ok() : NotFound();
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetLeague(Guid id)
        {
            var league = await _leagueService.GetByIdAsync(id);
            return league is null ? NotFound() : Ok(league);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeagues(string? searchTerm, int page = 1, int pageSize = 10)
        {
            var leagues = await _leagueService.GetAllAsync(searchTerm, page, pageSize);
            return Ok(leagues);
        }

        [HttpPost("{id:guid}/join")]
        public async Task<IActionResult> JoinLeague(Guid id)
        {
            var userId = User.GetObjectId();
            var reponse = await _leagueService.JoinLeague(id,userId);
            return Ok(reponse);
        }

        [HttpPost("{id:guid}/leave")]
        public async Task<IActionResult> LeaveLeague(Guid id, [FromQuery] Guid userIdToKick)
        {
            bool isKicking = userIdToKick != Guid.Empty;
            var userId = User.GetObjectId();
            var reponse = isKicking ? await _leagueService.LeaveLeague(id, userIdToKick, isKicking, userId) : 
                await _leagueService.LeaveLeague(id, userId, isKicking, null);
            if(!reponse.Success)
            {
                return BadRequest(new { message = reponse.ErrorMessage });
            }
            return Ok(reponse);
        }

        [HttpGet("my-leagues")]
        public async Task<IActionResult> GetMyLeagues()
        {
            var userId = User.GetObjectId();
            var result = await _leagueService.GetMyLeaguesAsync(userId);
            if (!result.Success)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }
            return Ok(result.Data);
        }

        [HttpGet("joined")]
        public async Task<IActionResult> GetJoinedLeagues()
        {
            var userId = User.GetObjectId();
            
            var result = await _leagueService.GetJoinedLeaguesAsync(userId);
            if (!result.Success)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }
            return Ok(result.Data);
        }

        [HttpPost("invite-user")]
        [Authorize]
        public async Task<IActionResult> InviteUser([FromQuery] Guid leagueId, [FromQuery] Guid userId, [FromQuery]bool isInvite)
        {
            var currentUserId = User.GetObjectId();
            var result = await _leagueService.InviteUserToLeagueAsync(leagueId, userId, currentUserId, isInvite);

            if (!result.Success)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }
    }
}
