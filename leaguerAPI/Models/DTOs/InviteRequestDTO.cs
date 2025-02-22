using System.ComponentModel.DataAnnotations;

namespace leaguerAPI.Models.DTOs
{
    public class InviteRequestDTO
    {
        public Guid LeagueId { get; set; }
        public Guid UserId { get; set; }
    }
}
