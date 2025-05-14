using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
using leaguerAPI.Models.Enums;
using leaguerAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Services
{
    public class TeamService : ITeamService
    {
        private readonly LeaguerDbContext _context;

        public TeamService(LeaguerDbContext context)
        {
            _context = context;
        }
        //this either needs to be updated to createTeamFromLeague or updated to support leagueless team creation
        public async Task<Response<TeamDTO>> CreateTeamAsync(TeamCreateDTO teamDTO, Guid leagueManagerId, Guid? leagueId = null)
        {
            try
            {
                var combinedUserIds = teamDTO.TeamManagerIds
                    .Concat(teamDTO.TeamUserIds ?? Enumerable.Empty<Guid>())
                    .ToList();

                if (leagueId != null)
                {
                    bool canAddTeam = await _context.LeagueUsers.AnyAsync(lu =>
                        lu.UserId == leagueManagerId &&
                        lu.LeagueId == leagueId &&
                        lu.IsManager);

                    if (!canAddTeam)
                        return Response<TeamDTO>.FailureResult("You do not have permission to add a team to this league");

                    if (!await AreUsersAvailableInLeague(combinedUserIds, leagueId.Value))
                        return Response<TeamDTO>.FailureResult("One or more users are already part of a team in this league");

                    if (!await ConfirmUsersExistInLeague(combinedUserIds, leagueId.Value))
                        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");
                }

                if (teamDTO.TeamManagerIds == null || !teamDTO.TeamManagerIds.Any())
                    return Response<TeamDTO>.FailureResult("At least one manager is required");

                var team = new Team
                {
                    Id = Guid.NewGuid(),
                    Name = teamDTO.Name,
                    Wins = 0,
                    Losses = 0,
                    TeamUsers = new List<TeamUser>()
                };

                if (leagueId != null)
                {
                    var teamLeague = new TeamLeague
                    {
                        TeamId = team.Id,
                        LeagueId = leagueId.Value
                    };
                    _context.TeamLeagues.Add(teamLeague);
                }

                AddTeamMembers(team, teamDTO.TeamManagerIds, TeamUserStatus.Member, true);

                if (teamDTO.TeamUserIds != null && teamDTO.TeamUserIds.Any())
                {
                    if (teamDTO.TeamUserIds.Any(id => teamDTO.TeamManagerIds.Contains(id)))
                        return Response<TeamDTO>.FailureResult("Managers cannot also be users");

                    AddTeamMembers(team, teamDTO.TeamUserIds, TeamUserStatus.Member, false);
                }

                await _context.Teams.AddAsync(team);
                await _context.SaveChangesAsync();

                return Response<TeamDTO>.SuccessResult(new TeamDTO(team));
            }
            catch (Exception ex)
            {
                return Response<TeamDTO>.FailureResult(ex.Message);
            }
        }

        //commented out because we shouldnt allow straight update of team users we need new endpoint for this
        public async Task<Response<TeamDTO>> UpdateTeamAsync(TeamUpdateDTO teamDTO)
        {
            try
            {
                var team = await _context.Teams.Include(t => t.TeamUsers)
                                               .FirstOrDefaultAsync(t => t.Id == teamDTO.Id);
                if (team == null)
                    return Response<TeamDTO>.FailureResult("Team not found");

                //var combinedUserIds = teamDTO.TeamManagerIds
                //    .Concat(teamDTO.TeamUserIds ?? Enumerable.Empty<Guid>())
                //    .ToList();

                //var teamLeagues = await _context.TeamLeagues.AsNoTracking().Where(tl=> tl.TeamId == team.Id).ToListAsync();

                //if(teamLeagues != null && teamLeagues.Count > 0)
                //{
                //    foreach (var teamLeague in teamLeagues)
                //    {
                //        if (!await AreUsersAvailableInLeague(combinedUserIds, teamLeague.LeagueId, team.Id))
                //            return Response<TeamDTO>.FailureResult("One or more users are already part of a team in this league");
                //    }
                //}



                team.Name = teamDTO.Name;

                //if (teamDTO.TeamManagerIds == null || !teamDTO.TeamManagerIds.Any())
                //    return Response<TeamDTO>.FailureResult("At least one manager is required");

                //var currentManagerIds = team.TeamUsers
                //    .Where(tu => tu.IsManager)
                //    .Select(tu => tu.UserId)
                //    .OrderBy(id => id)
                //    .ToList();
                //var newManagerIds = teamDTO.TeamManagerIds.OrderBy(id => id).ToList();

                //if (!currentManagerIds.SequenceEqual(newManagerIds))
                //{
                //    if (!await ConfirmUsersExistInLeague(teamDTO.TeamManagerIds, team.LeagueId))
                //        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");

                //    foreach (var tu in team.TeamUsers.Where(tu => tu.Status == TeamUserStatus.Manager).ToList())
                //        team.TeamUsers.Remove(tu);

                //    AddTeamMembers(team, teamDTO.TeamManagerIds, TeamUserStatus.Member, true);
                //}

                //var currentTeamUserIds = team.TeamUsers
                //    .Where(tu => tu.Status == TeamUserStatus.Member)
                //    .Select(tu => tu.UserId)
                //    .OrderBy(id => id)
                //    .ToList();
                //var newTeamUserIds = (teamDTO.TeamUserIds ?? new List<Guid>()).OrderBy(id => id).ToList();

                //if (!currentTeamUserIds.SequenceEqual(newTeamUserIds))
                //{
                //    if (teamDTO.TeamUserIds != null && teamDTO.TeamUserIds.Any(id => teamDTO.TeamManagerIds.Contains(id)))
                //        return Response<TeamDTO>.FailureResult("Managers cannot also be users");

                //    if (teamDTO.TeamUserIds != null && !await ConfirmUsersExistInLeague(teamDTO.TeamUserIds, team.LeagueId))
                //        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");

                //    foreach (var tu in team.TeamUsers.Where(tu => tu.Status == TeamUserStatus.Member).ToList())
                //        team.TeamUsers.Remove(tu);

                //    if (teamDTO.TeamUserIds != null)
                //        AddTeamMembers(team, teamDTO.TeamUserIds, TeamUserStatus.Member, false);
                //}

                //await _context.SaveChangesAsync();
                return Response<TeamDTO>.SuccessResult(new TeamDTO(team));
            }
            catch (Exception ex)
            {
                return Response<TeamDTO>.FailureResult(ex.Message);
            }
        }

        public async Task<Response<TeamDTO>> GetTeamByIdAsync(Guid teamId)
        {
            try
            {
                var team = await _context.Teams
                    .AsNoTracking()
                    .Include(t => t.TeamUsers)
                        .ThenInclude(tu => tu.User)
                    .Include(t => t.EventTeams)
                        .ThenInclude(et => et.Event)
                        .ThenInclude(e => e.EventResult)
                    .Include(t => t.TeamLeagues)
                        .ThenInclude(tl => tl.League)
                    .FirstOrDefaultAsync(t => t.Id == teamId);

                if (team == null)
                    return Response<TeamDTO>.FailureResult("Team not found");

                return Response<TeamDTO>.SuccessResult(new TeamDTO(team));
            }
            catch (Exception ex)
            {
                return Response<TeamDTO>.FailureResult(ex.Message);
            }
        }

        public async Task<Response<IEnumerable<TeamDTO>>> GetTeamsByLeagueIdAsync(Guid leagueId)
        {
            try
            {
                var teams = await _context.Teams
                    .AsNoTracking()
                    .Where(t => t.TeamLeagues.Any(tl => tl.LeagueId == leagueId))
                    .Include(t => t.TeamUsers)
                    .Select(t => new TeamDTO(t))
                    .ToListAsync();

                return Response<IEnumerable<TeamDTO>>.SuccessResult(teams);
            }
            catch (Exception ex)
            {
                return Response<IEnumerable<TeamDTO>>.FailureResult(ex.Message);
            }
        }

        private async Task<bool> AreUsersAvailableInLeague(List<Guid> userIds, Guid leagueId)
        {
            var guidsBeingUsed = await _context.Teams
                    .Where(t => t.TeamLeagues.Any(tl => tl.LeagueId == leagueId))
                    .SelectMany(t => t.TeamUsers)
                    .Select(tu => tu.UserId)
                    .ToListAsync();

            return !userIds.Any(guid => guidsBeingUsed.Contains(guid));
        }

        private async Task<bool> ConfirmUsersExistInLeague(IEnumerable<Guid> userIds, Guid leagueId)
        {
            if (userIds == null || !userIds.Any())
                return true;

            var distinctUserIds = userIds.Distinct().ToList();
            var count = await _context.ConfirmedLeagueUsers.CountAsync(u =>
                distinctUserIds.Contains(u.UserId) && u.LeagueId == leagueId);

            return count == distinctUserIds.Count;
        }

        private void AddTeamMembers(Team team, IEnumerable<Guid> userIds, TeamUserStatus status, bool isManager)
        {
            foreach (var userId in userIds)
            {
                team.TeamUsers.Add(new TeamUser
                {
                    TeamId = team.Id,
                    UserId = userId,
                    Status = status,
                    IsManager = isManager
                });
            }
        }

        public async Task<Response<List<TeamDTO>>> GetMyTeamsAsync(Guid userId)
        {
            if (userId == Guid.Empty)
                return Response<List<TeamDTO>>.FailureResult("Invalid User Id");

            var teams = await _context.Teams.AsNoTracking()
                    .Where(t => t.TeamUsers
                    .Any(tu => tu.UserId == userId
                               && tu.IsManager))
                    .Include(t => t.TeamLeagues)
                        .ThenInclude(tl => tl.League)
                    .Select(t => new TeamDTO(t))
                    .ToListAsync();

            return Response<List<TeamDTO>>.SuccessResult(teams);
        }

        public async Task<Response<bool>> InviteOrRequestToTeam(Guid teamId, Guid userId, Guid currentUserId, bool isInvite)
        {
            var team = await _context.Teams.Include(t => t.TeamUsers).FirstOrDefaultAsync(t => t.Id == teamId);
            if (team == null)
                return Response<bool>.FailureResult("Team not found");
            if (isInvite)
            {
                var isManager = team.TeamUsers.Any(tu => tu.UserId == currentUserId && tu.IsManager);
                if (!isManager)
                    return Response<bool>.FailureResult("You do not have permission to invite to this team");
            }

            var teamLeagues = await _context.TeamLeagues.AsNoTracking().Where(tl => tl.TeamId == teamId).ToListAsync();
            if (teamLeagues != null && teamLeagues.Count > 0)
            {
                foreach (var teamLeague in teamLeagues)
                {
                    if (!await AreUsersAvailableInLeague(new List<Guid> { userId }, teamLeague.LeagueId))
                        return Response<bool>.FailureResult("One or more users are already part of a team in this league");
                }
            }

            team.TeamUsers.Add(new TeamUser
            {
                TeamId = teamId,
                UserId = userId,
                Status = isInvite ? TeamUserStatus.Invited : TeamUserStatus.Requested
            });

            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<bool>> DeclineInviteOrRequest(Guid teamId, Guid userId, Guid currentUserId)
        {
            var team = await _context.Teams.Include(t => t.TeamUsers).FirstOrDefaultAsync(t => t.Id == teamId);
            if (team == null)
                return Response<bool>.FailureResult("Team not found");

            if (userId != currentUserId)
            {
                var isManager = team.TeamUsers.Any(tu => tu.UserId == currentUserId && tu.IsManager);
                if (!isManager)
                    return Response<bool>.FailureResult("You do not have permission to decline this invite");
            }

            var teamUser = team.TeamUsers.FirstOrDefault(tu => tu.UserId == userId);
            if (teamUser == null)
                return Response<bool>.FailureResult("User is not part of this team");

            if (teamUser.Status == TeamUserStatus.Member)
                return Response<bool>.FailureResult("User is already a member of this team");

            if (teamUser.IsManager)
                return Response<bool>.FailureResult("Cannot remove a manager from the team");

            team.TeamUsers.Remove(teamUser);
            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<bool>> AcceptRequestOrInvite(Guid teamId, Guid userId, Guid currentUserId)
        {
            var team = await _context.Teams
                .Include(t => t.TeamLeagues)
                .Include(t => t.TeamUsers)
                .FirstOrDefaultAsync(t => t.Id == teamId);
            if (team == null)
                return Response<bool>.FailureResult("Team not found");

            if (userId != currentUserId)
            {
                var isManager = team.TeamUsers.Any(tu => tu.UserId == currentUserId && tu.IsManager);
                if (!isManager)
                    return Response<bool>.FailureResult("You do not have permission to accept this request");
            }

            var teamUser = team.TeamUsers.FirstOrDefault(tu => tu.UserId == userId);
            if (teamUser == null)
                return Response<bool>.FailureResult("User invite/request not found");

            if (teamUser.Status == TeamUserStatus.Member)
                return Response<bool>.FailureResult("User is already a member of this team");

            if (teamUser.Status == TeamUserStatus.Requested && userId == currentUserId)
            {
                return Response<bool>.FailureResult("User cannot accept own request");
            }

            if (teamUser.Status == TeamUserStatus.Invited && userId != currentUserId)
            {
                return Response<bool>.FailureResult("Manager cannot accept users invite");
            }

            teamUser.Status = TeamUserStatus.Member;

            if (team.TeamLeagues != null && team.TeamLeagues.Count > 0)
            {
                foreach (var tl in team.TeamLeagues)
                {
                    var leagueUser = await _context.LeagueUsers.IgnoreQueryFilters()
                        .FirstOrDefaultAsync(lu => lu.UserId == userId && lu.LeagueId == tl.LeagueId);
                    if (leagueUser == null)
                    {
                        _context.Add(new LeagueUser { LeagueId = tl.LeagueId, UserId = userId, Status = LeagueUserStatus.Member });
                    }
                    else
                    {
                        leagueUser.Status = LeagueUserStatus.Member;

                    }
                }
            }

            await _context.SaveChangesAsync();
            return Response<bool>.SuccessResult(true);
        }

        public async Task<Response<bool>> LeaveTeam(Guid teamId, Guid currentUserId, Guid userIdToKick)
        {
            var team = await _context.Teams.Include(t => t.TeamUsers).FirstOrDefaultAsync(t => t.Id == teamId);
            if (team == null)
                return Response<bool>.FailureResult("Team not found");

            if (userIdToKick == currentUserId)
            {
                return Response<bool>.FailureResult("please dont kick yourself");
            }
            else if (userIdToKick == Guid.Empty)
            {
                var teamUser = team.TeamUsers.FirstOrDefault(tu => tu.UserId == currentUserId);
                if (teamUser == null)
                    return Response<bool>.FailureResult("User is not part of this team");
                if (teamUser.IsManager && team.TeamUsers.Where(tu => tu.IsManager).Count() == 1)
                    return Response<bool>.FailureResult("There must be a manager in the team");
                team.TeamUsers.Remove(teamUser);
                await _context.SaveChangesAsync();
                return Response<bool>.SuccessResult(true);
            }
            else
            {
                var canKick = team.TeamUsers.Any(tu => tu.UserId == currentUserId && tu.IsManager);
                if (!canKick)
                    return Response<bool>.FailureResult("You do not have permission to kick from this team");
                var teamUser = team.TeamUsers.FirstOrDefault(tu => tu.UserId == userIdToKick);
                if (teamUser == null)
                    return Response<bool>.FailureResult("User is not part of this team");
                team.TeamUsers.Remove(teamUser);
                await _context.SaveChangesAsync();
                return Response<bool>.SuccessResult(true);
            }
        }

        public async Task<Response<bool>> RejectTeamCreation(Guid teamId, Guid currentUserId, Guid leagueId)
        {
            try
            {
                var canReject = await _context.LeagueUsers.AnyAsync(lu => lu.UserId == currentUserId && lu.LeagueId == leagueId && lu.IsManager);
                if (!canReject)
                    return Response<bool>.FailureResult("You do not have permission to reject this team");

                var team = await _context.Teams.Include(t => t.TeamUsers).FirstOrDefaultAsync(t => t.Id == teamId);
                if (team == null)
                    return Response<bool>.FailureResult("Team not found");
                _context.TeamUsers.RemoveRange(team.TeamUsers);
                _context.Teams.Remove(team);
                await _context.SaveChangesAsync();
                return Response<bool>.SuccessResult(true);
            }
            catch (Exception ex)
            {
                return Response<bool>.FailureResult(ex.Message);
            }
        }

        public async Task<Response<List<TeamDTO>>> GetMyJoinedTeams(Guid userId)
        {
            try
            {
                var teams = await _context.Teams.AsNoTracking()
                    .Where(t => t.TeamUsers.Any(tu => tu.UserId == userId
                                            && (tu.Status == TeamUserStatus.Member)))
                    .Include(t => t.TeamLeagues)
                        .ThenInclude(tu => tu.League)
                    .Select(t => new TeamDTO(t))
                    .ToListAsync();
                return Response<List<TeamDTO>>.SuccessResult(teams);
            }
            catch (Exception ex)
            {
                return Response<List<TeamDTO>>.FailureResult(ex.Message);
            }
        }

        public async Task<Response<PagedResult<TeamDTO>>> SearchAsync(string searchTerm, int page, int pageSize)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Response<PagedResult<TeamDTO>>.FailureResult("Search term is required");
            }
            if (page < 1)
            {
                return Response<PagedResult<TeamDTO>>.FailureResult("Page must be greater than 0");
            }
            if (pageSize < 1 || pageSize > 50)
            {
                return Response<PagedResult<TeamDTO>>.FailureResult("Page size must be between 1 and 50");
            }

            try
            {
                var query = _context.Teams.AsNoTracking()
                                    .Where(t => t.Name.Contains(searchTerm) || t.TeamUsers.Any(tu => tu.User.Email.Contains(searchTerm)))
                                    .Select(u => new TeamDTO(u));

                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var totalCount = await query.CountAsync();

                var result = new PagedResult<TeamDTO>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = page,
                    PageSize = pageSize
                };

                return Response<PagedResult<TeamDTO>>.SuccessResult(result);
            }
            catch (Exception ex)
            {
                // Consider logging the exception here
                return Response<PagedResult<TeamDTO>>.FailureResult($"Error searching users: {ex.Message}");
            }
        }
    }
}
