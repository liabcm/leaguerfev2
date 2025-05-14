using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Models.Enums;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class UserService : IUserService
    {
        private readonly LeaguerDbContext _context;

        public UserService(LeaguerDbContext context)
        {
            _context = context;
        }
        //to test
        public async Task<User> CreateUserAsync(CreateUserDTO user)
        {
            var userExists = _context.Users.Any(u => u.Id == user.Id);
            if (userExists)
            {
                return null;
            }

            User userToAdd = new User()
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
            await _context.AddAsync(userToAdd);
            await _context.SaveChangesAsync();
            return userToAdd;
        }

        public async Task<User> GetByIdAsync(Guid id)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Response<PagedResult<UserDTO>>> SearchUsersToInviteAsync(Guid leagueId, string searchTerm, int page = 1, int pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Search term is required");
            }

            if (page < 1)
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Page must be greater than 0");
            }

            if (pageSize < 1 || pageSize > 50)
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Page size must be between 1 and 50");
            }
            try
            {
                var query = _context.Users
                                .AsNoTracking()
                                .Where(u =>
                                    (u.Name.Contains(searchTerm) ||
                                     u.Email.Contains(searchTerm)) &&
                                    !_context.LeagueUsers.Any(lu =>
                                        lu.UserId == u.Id &&
                                        lu.LeagueId == leagueId))
                                .Select(u => new UserDTO(u));

                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var totalCount = await query.CountAsync();

                var result = new PagedResult<UserDTO>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = pageSize
                };

                return Response<PagedResult<UserDTO>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                return Response<PagedResult<UserDTO>>.FailureResult($"Error searching users: {ex.Message}");
            }
        }

        public async Task<Response<List<LeagueUserDTO>>> GetCurrentUserInvitesAsync(Guid userId)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return Response<List<LeagueUserDTO>>.FailureResult("User not found");
                }

                var invites = await _context.LeagueUserRequestsAndInvites.AsNoTracking()
                    .Include(lu => lu.League)
                    .Where(lu => lu.UserId == userId)
                    .Select(lu => new LeagueUserDTO(lu))
                    .ToListAsync();

                return Response<List<LeagueUserDTO>>.SuccessResult(invites);
            }
            catch (Exception ex)
            {
                return Response<List<LeagueUserDTO>>.FailureResult($"Failed to retrieve user invites: {ex.Message}");
            }
        }

        public async Task<Response<bool>> DeclineInviteAsync(Guid leagueId, Guid userId, Guid currentUserId)
        {
            if (leagueId == Guid.Empty || userId == Guid.Empty || currentUserId == Guid.Empty)
            {
                return Response<bool>.FailureResult("Invalid LeagueId or UserId.");
            }

            if (userId != currentUserId)
            {
                var canDecline = await _context.ConfirmedLeagueUsers
                    .AnyAsync(lu => lu.LeagueId == leagueId && lu.UserId == currentUserId && lu.IsManager);
                if (!canDecline)
                {
                    return Response<bool>.FailureResult("You do not have permission to decline this invite.");
                }
            }

            var record = await _context.LeagueUserRequestsAndInvites
                .FirstOrDefaultAsync(lu => lu.LeagueId == leagueId && lu.UserId == userId);

            if (record == null)
            {
                return Response<bool>.FailureResult("Invite not found");
            }

            _context.Remove(record);
            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<bool>> AcceptInviteAsync(Guid leagueId, Guid userId, Guid currentUserId)
        {
            if (leagueId == Guid.Empty || userId == Guid.Empty || currentUserId == Guid.Empty)
            {
                return Response<bool>.FailureResult("Invalid LeagueId or UserId.");
            }

            if (userId != currentUserId)
            {
                var canAccept = await _context.ConfirmedLeagueUsers
                    .AnyAsync(lu => lu.LeagueId == leagueId && lu.UserId == currentUserId && lu.IsManager);
                if (!canAccept)
                {
                    return Response<bool>.FailureResult("You do not have permission to accept this invite.");
                }
            }

            var record = await _context.LeagueUserRequestsAndInvites
                .FirstOrDefaultAsync(lu => lu.LeagueId == leagueId && lu.UserId == userId);

            if (record == null)
            {
                return Response<bool>.FailureResult("Invite not found or already accepted.");
            }

            if (record.Status == LeagueUserStatus.Requested && userId == currentUserId)
            {
                return Response<bool>.FailureResult("User cannot accept own request");
            }

            if (record.Status == LeagueUserStatus.Invited && userId != currentUserId)
            {
                return Response<bool>.FailureResult("Manager Cannot accept invite for user");
            }

            record.Status = LeagueUserStatus.Member;
            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<PagedResult<UserDTO>>> SearchUsersToInviteTeamsAsync(Guid teamId, string searchTerm, int page, int pageSize)
        {
            // Validate input parameters
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Search term is required");
            }
            if (page < 1)
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Page must be greater than 0");
            }
            if (pageSize < 1 || pageSize > 50)
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Page size must be between 1 and 50");
            }

            try
            {
                var query = _context.Users.AsNoTracking()
                                    .Where(u => (u.Name.Contains(searchTerm) || u.Email.Contains(searchTerm))
                                                    && !_context.TeamUsers.Any(tu => tu.UserId == u.Id && tu.TeamId == teamId))
                                    .Select(u => new UserDTO(u));

                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var totalCount = await query.CountAsync();

                var result = new PagedResult<UserDTO>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = pageSize
                };

                return Response<PagedResult<UserDTO>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                // Consider logging the exception here
                return Response<PagedResult<UserDTO>>.FailureResult($"Error searching users: {ex.Message}");
            }
        }

        public async Task<Response<List<TeamUserDTO>>> GetCurrentUserTeamInvitesAndRequests(Guid userId)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return Response<List<TeamUserDTO>>.FailureResult("User not found");
                }

                var invites = await _context.TeamUsers.AsNoTracking().Include(tu => tu.Team)
                    .Where(tu => tu.UserId == userId
                    && (tu.Status == TeamUserStatus.Invited || tu.Status == TeamUserStatus.Requested))
                    .Select(tu => new TeamUserDTO(tu))
                    .ToListAsync();

                return Response<List<TeamUserDTO>>.SuccessResult(invites);
            }
            catch (Exception ex)
            {
                return Response<List<TeamUserDTO>>.FailureResult($"Failed to retrieve team user invites: {ex.Message}");
            }
        }

        public async Task<Response<PagedResult<UserDTO>>> SearchUsersForEventInviteAsync(Guid eventId, string searchTerm, int page, int pageSize)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Search term is required");
            }
            if (page < 1)
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Page must be greater than 0");
            }
            if (pageSize < 1 || pageSize > 50)
            {
                return Response<PagedResult<UserDTO>>.FailureResult("Page size must be between 1 and 50");
            }

            try
            {
                var query = _context.Users.AsNoTracking()
                                    .Where(u => (u.Name.Contains(searchTerm) || u.Email.Contains(searchTerm))
                                    && !_context.EventUsers.Any(eu => eu.UserId == u.Id && eu.EventId == eventId))
                                    .Select(u => new UserDTO(u));

                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var totalCount = await query.CountAsync();

                var result = new PagedResult<UserDTO>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = pageSize
                };

                return Response<PagedResult<UserDTO>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                // Consider logging the exception here
                return Response<PagedResult<UserDTO>>.FailureResult($"Error searching users: {ex.Message}");
            }
        }
    }
}
