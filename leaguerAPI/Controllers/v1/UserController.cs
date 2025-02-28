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
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO user)
        {
            var response = await _userService.CreateUserAsync(user);
            if (response is null)
            {
                return BadRequest();
            }
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user is null ? NotFound() : Ok(user);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(
        [FromQuery] Guid leagueId,
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            var result = await _userService.SearchUsersToInviteAsync(leagueId, q, page, pageSize);

            if (!result.Success)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpGet("current-invites")]
        public async Task<IActionResult> GetCurrentUserInvites()
        {
            var userId = User.GetObjectId();
            var result = await _userService.GetCurrentUserInvitesAsync(userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("decline")]
        public async Task<IActionResult> DeclineInvite([FromBody] InviteRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(Response<bool>.FailureResult("Invalid request data"));
            }
            var userId = User.GetObjectId();

            var response = await _userService.DeclineInviteAsync(request.LeagueId, request.UserId, userId);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpPost("accept")]
        public async Task<IActionResult> AcceptInvite([FromBody] InviteRequestDTO request)
        {
            // Basic GUID validation
            if (request.LeagueId == Guid.Empty || request.UserId == Guid.Empty)
            {
                return BadRequest(Response<bool>.FailureResult("LeagueId and UserId must be valid GUIDs."));
            }

            var result = await _userService.AcceptInviteAsync(request.LeagueId, request.UserId, User.GetObjectId());

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpGet("search-team")]
        public async Task<IActionResult> SearchUsersForTeam(
        [FromQuery] Guid teamId,
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            var result = await _userService.SearchUsersToInviteTeamsAsync(teamId, q, page, pageSize);

            if (!result.Success)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpGet("current-team-invites")]
        public async Task<IActionResult> GetCurrentTeamInvites()
        {
            var result = await _userService.GetCurrentUserTeamInvitesAndRequests(User.GetObjectId());
            if (!result.Success)
            {
                return BadRequest(result.ErrorMessage);
            }
            return Ok(result.Data);
        }
    }
}
