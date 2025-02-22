namespace leaguerAPI.Models.DTOs
{
    public class UserDTO
    {
        public UserDTO(User user)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
