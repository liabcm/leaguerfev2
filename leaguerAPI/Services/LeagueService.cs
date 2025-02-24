using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class LeagueService : ILeagueService
    {
        private readonly LeaguerDbContext _context;

        public LeagueService(LeaguerDbContext context)
        {
            _context = context;
        }

        public async Task<Response<LeagueDTO>> CreateAsync(LeagueInputDTO request, Guid userId)
        {
            Response<LeagueDTO> response = new Response<LeagueDTO>();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            var league = new League
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Sport = request.Sport,
                isCompetitive = request.isCompetitive,//update casing this isnt java 
                isPublic = request.isPublic,
                CreatedBy = userId,
                IsTeamLeague = request.IsTeamLeague,
            };

            _context.Leagues.Add(league);

            _context.LeagueUsers.Add(new LeagueUser
            {
                LeagueId = league.Id,
                User = user,
                Status = LeagueUserStatus.Member,
                IsManager = true
            });

            await _context.SaveChangesAsync();
            response.Data = new LeagueDTO(league);
            return response;
        }

        public async Task<LeagueDTO?> GetByIdAsync(Guid id)
        {
            var league = await _context.Leagues
                .AsNoTracking()
                    .Include(l => l.Events)
                    .ThenInclude(e => e.EventUsers)
                    .ThenInclude(eu => eu.User)
                    .Include(l => l.LeagueUsers)
                    .ThenInclude(lu => lu.User)
                    .Include(l => l.Teams)
                    .ThenInclude(t => t.TeamUsers)
                .FirstOrDefaultAsync(l => l.Id == id);

            return new LeagueDTO(league);
        }

        public async Task<PagedResult<LeagueDTO>> GetAllAsync(string? searchTerm, int page, int pageSize)
        {
            var query = _context.Leagues.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(l =>
                    l.Name.Contains(searchTerm) ||
                    l.Sport.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .AsNoTracking()
                .OrderBy(l => l.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<LeagueDTO>
            {
                Items = items.Select(l => new LeagueDTO(l)),
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }

        public async Task<bool> UpdateAsync(LeagueInputDTO request)
        {
            var league = await _context.Leagues.FirstOrDefaultAsync(league => league.Id == request.Id);
            if (league == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(request.Name))
            {
                league.Name = request.Name;
            }
            if (!string.IsNullOrEmpty(request.Sport))
            {
                league.Sport = request.Sport;
            }
            if (request.isPublic != league.isPublic)
            {
                league.isPublic = request.isPublic;
            }
            if (request.isCompetitive != league.isCompetitive)
            {
                league.isCompetitive = request.isCompetitive;
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Response<bool>> JoinLeague(Guid leagueId, Guid userId)
        {
            Response<bool> response = new Response<bool>();
            var leagueUser = await _context.LeagueUsers.IgnoreQueryFilters().FirstOrDefaultAsync(lu => lu.UserId == userId && lu.LeagueId == leagueId);
            if (leagueUser != null && leagueUser.IsDeleted)
            {
                leagueUser.IsDeleted = false;
                await _context.SaveChangesAsync();
                return response;
            }
            else if (leagueUser != null && !leagueUser.IsDeleted)
            {
                response.ErrorMessage = "User already joined league";
                return response;

            }
            await _context.LeagueUsers.AddAsync(new LeagueUser() { LeagueId = leagueId, UserId = userId });
            await _context.SaveChangesAsync();
            response.Data = true;
            return response;
        }

        public async Task<Response<bool>> LeaveLeague(Guid leagueId, Guid userId, bool kicking, Guid? managerId)
        {
            if (kicking)
            {
                if (userId == managerId)
                {
                    return Response<bool>.FailureResult("Please dont kick yourself!");
                }
                var manager = await _context.LeagueUsers
                    .FirstOrDefaultAsync(lu => lu.UserId == managerId && lu.LeagueId == leagueId && lu.IsManager);
                if (manager == null)
                {
                    return Response<bool>.FailureResult("User not authorized to kick");
                }
            }
            var leagueUser = await _context.LeagueUsers.IgnoreQueryFilters().FirstOrDefaultAsync(lu => lu.UserId == userId && lu.LeagueId == leagueId);
            if (leagueUser == null || leagueUser.IsDeleted)
            {
                return Response<bool>.FailureResult("User not in league");
            }
            leagueUser.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<List<LeagueDTO>>> GetMyLeaguesAsync(Guid userId)
        {
            try
            {
                var leagues = await _context.Leagues
                    .AsNoTracking()
                    .Include(l => l.Events)
                    .ThenInclude(e => e.EventUsers)
                    .ThenInclude(eu => eu.User)
                    .Include(l => l.LeagueUsers)
                    .ThenInclude(lu => lu.User)
                    .Include(l => l.Teams)
                    .Where(l => l.CreatedBy == userId)
                    .Select(l => new LeagueDTO(l))
                    .ToListAsync();

                return new Response<List<LeagueDTO>>()
                {
                    Data = leagues,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new Response<List<LeagueDTO>>()
                {
                    ErrorMessage = ex.Message,
                    Success = false
                };
            }
        }

        public async Task<Response<List<LeagueDTO>>> GetJoinedLeaguesAsync(Guid userId)
        {
            try
            {
                var leagues = await _context.Leagues
                    .AsNoTracking()
                    .Include(l => l.LeagueUsers)
                    .ThenInclude(lu => lu.User)
                    .Where(l => l.LeagueUsers.Any(lu => lu.UserId == userId && lu.Status == LeagueUserStatus.Member))
                    .Select(l => new LeagueDTO(l))
                    .ToListAsync();

                return new Response<List<LeagueDTO>>()
                {
                    Data = leagues,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new Response<List<LeagueDTO>>()
                {
                    ErrorMessage = ex.Message,
                    Success = false
                };
            }
        }

        public async Task<Response<bool>> InviteUserToLeagueAsync(Guid leagueId, Guid invitedUserId, Guid currentUserId, bool isInvite)
        {
            // Check if current user is a manager of the league (only for invites)
            if (isInvite)
            {
                var isManager = await _context.LeagueUsers
                    .Include(lu => lu.League)//remove this at some point when you implement add new manager
                    .AnyAsync(lu => lu.LeagueId == leagueId
                        && lu.UserId == currentUserId
                        && lu.Status == LeagueUserStatus.Member
                        && (lu.IsManager || lu.League.CreatedBy == currentUserId)
                        && !lu.IsDeleted);

                if (!isManager)
                {
                    return Response<bool>.FailureResult("User is not authorized to invite members to this league");
                }
            }

            // Retrieve the league
            var league = await _context.Leagues.FirstOrDefaultAsync(l => l.Id == leagueId);
            if (league == null)
            {
                return Response<bool>.FailureResult("League not found");
            }

            // Prevent requests to join private leagues
            if (!league.isPublic && !isInvite)
            {
                return Response<bool>.FailureResult("User cannot request to join private leagues");
            }

            // Check for existing record for the user-league pair
            var existingRecord = await _context.LeagueUsers.IgnoreQueryFilters()
                .FirstOrDefaultAsync(lu => lu.LeagueId == leagueId && lu.UserId == invitedUserId);

            if (existingRecord != null)
            {
                if (existingRecord.IsDeleted)
                {
                    // Reactivate the record by updating the status
                    existingRecord.Status = isInvite ? LeagueUserStatus.Invited : LeagueUserStatus.Requested;
                    existingRecord.IsDeleted = false;
                }
                else if (existingRecord.Status == LeagueUserStatus.Member)
                {
                    return Response<bool>.FailureResult("User is already a member of this league");
                }
                else if (existingRecord.Status == LeagueUserStatus.Invited || existingRecord.Status == LeagueUserStatus.Requested)
                {
                    return Response<bool>.FailureResult("User has already been invited or has a pending request");
                }
            }
            else
            {
                // Create a new record
                var newRecord = new LeagueUser
                {
                    LeagueId = leagueId,
                    UserId = invitedUserId,
                    Status = isInvite ? LeagueUserStatus.Invited : LeagueUserStatus.Requested,
                    IsManager = false,
                };
                await _context.LeagueUsers.AddAsync(newRecord);
            }

            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }
    }
}
