using leaguerAPI.Extensions;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace leaguerAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] TeamCreateDTO teamCreateDTO, Guid? leagueId)
        {
            if (teamCreateDTO == null)
            {
                return BadRequest(Response<TeamDTO>.FailureResult("Team data is required."));
            }

            var response = await _teamService.CreateTeamAsync(teamCreateDTO, User.GetObjectId(), leagueId);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response.Data);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTeam([FromBody] TeamUpdateDTO teamUpdateDTO)
        {
            if (teamUpdateDTO == null)
            {
                return BadRequest(Response<TeamDTO>.FailureResult("Team data is required."));
            }

            var response = await _teamService.UpdateTeamAsync(teamUpdateDTO);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response.Data);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeamById(Guid teamId)
        {
            var response = await _teamService.GetTeamByIdAsync(teamId);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response.Data);
        }

        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetTeamsByLeagueId(Guid leagueId)
        {
            var response = await _teamService.GetTeamsByLeagueIdAsync(leagueId);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response.Data);
        }

        [HttpGet("my-teams")]
        public async Task<IActionResult> GetMyTeams()
        {
            var response = await _teamService.GetMyTeamsAsync(User.GetObjectId());
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response.Data);
        }

        [HttpPost("invite-request")]
        public async Task<IActionResult> InviteOrRequestToTeam(Guid teamId, Guid userId, bool isInvite)
        {
            var response = await _teamService.InviteOrRequestToTeam(teamId, userId, User.GetObjectId(), isInvite);
            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }
            return Ok(response.Data);
        }

        [HttpPost("decline")]
        public async Task<IActionResult> DeclineInviteOrRequest(Guid teamId, Guid userId)
        {
            var response = await _teamService.DeclineInviteOrRequest(teamId, userId, User.GetObjectId());
            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }
            return Ok(response.Data);
        }

        [HttpPost("accept-invite")]
        public async Task<IActionResult> AcceptRequestOrInvite(Guid teamId, Guid userId)
        {
            var response = await _teamService.AcceptRequestOrInvite(teamId, userId, User.GetObjectId());
            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }
            return Ok(response.Data);
        }

        [HttpPost("{id:guid}/leave")]
        public async Task<IActionResult> LeaveTeam(Guid id, Guid userIdToKick)
        {
            var response = await _teamService.LeaveTeam(id, User.GetObjectId(), userIdToKick);
            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }
            return Ok(response.Data);
        }

        [HttpPost("reject/{teamId}")]
        public async Task<IActionResult> RejectTeamCreation(Guid teamId, Guid leagueId)
        {
            var response = await _teamService.RejectTeamCreation(teamId, User.GetObjectId(), leagueId);
            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }
            return Ok(response.Data);
        }

        [HttpGet("my-joined-teams")]
        public async Task<IActionResult> GetMyJoinedTeams()
        {
            var response = await _teamService.GetMyJoinedTeams(User.GetObjectId());
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response.Data);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchTeams(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            var result = await _teamService.SearchAsync(q, page, pageSize);

            if (!result.Success)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }
    }
}
