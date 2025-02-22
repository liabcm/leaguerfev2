using leaguerAPI.Models;
using leaguerAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace leaguerAPI.Controllers.v1
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SportController : ControllerBase
    {
        private readonly ISportService _sportService;

        public SportController(ISportService sportService)
        {
            _sportService = sportService;
        }

        [HttpPost]
        public async Task<ActionResult<Sport>> CreateSport(Sport sport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdSport = await _sportService.CreateSportAsync(sport);
            return CreatedAtAction(nameof(CreateSport), new { id = createdSport.Id }, createdSport);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sport>>> GetAllSports()
        {
            var sports = await _sportService.GetAllSportsAsync();
            return Ok(sports);
        }
    }
}
