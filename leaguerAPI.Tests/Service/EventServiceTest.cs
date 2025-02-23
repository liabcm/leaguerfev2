using System;
using System.Threading.Tasks;
using leaguerAPI.Database;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;
using leaguerAPI.Models; // or the appropriate namespace where League and User are defined

public class EventServiceTests
{
    private readonly EventService _eventService;
    private readonly LeaguerDbContext _context;

    public EventServiceTests()
    {
        var options = new DbContextOptionsBuilder<LeaguerDbContext>()
            .UseSqlServer("Server=tcp:leaguer.database.windows.net,1433;Initial Catalog=leaguer;Persist Security Info=False;User ID=coach;Password=KingOfThePirates@GL2;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;") // Use the same connection string as your API
            .Options;

        _context = new LeaguerDbContext(options);
        _eventService = new EventService(_context);
    }

    [Fact]
    public async Task CreateEvent_ShouldReturnError_WhenLeagueNotFound()
    {
        // Arrange
        var eventDto = new EventInputDTO { LeagueId = Guid.NewGuid() };
        var userId = Guid.NewGuid();

        // Act
        var result = await _eventService.CreateEvent(eventDto, userId);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("League not found", result.ErrorMessage);
    }
}
