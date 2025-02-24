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
        public async Task<IActionResult> CreateTeam([FromBody] TeamCreateDTO teamCreateDTO)
        {
            if (teamCreateDTO == null)
            {
                return BadRequest(Response<TeamDTO>.FailureResult("Team data is required."));
            }

            var response = await _teamService.CreateTeamAsync(teamCreateDTO, User.GetObjectId());
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
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

            return Ok(response);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeamById(Guid teamId)
        {
            var response = await _teamService.GetTeamByIdAsync(teamId);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpGet("league/{leagueId}")]
        public async Task<IActionResult> GetTeamsByLeagueId(Guid leagueId)
        {
            var response = await _teamService.GetTeamsByLeagueIdAsync(leagueId);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}
