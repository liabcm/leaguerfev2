namespace leaguerAPI.Models.DTOs
{
    public class CreateMatchDTO
    {
        public Guid Opponent1Id { get; set; }
        public Guid Opponent2Id { get; set; }
        public int MatchNumber { get; set; }
        public int Round { get; set; }
    }
}
