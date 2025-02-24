using leaguerAPI.Database;
using leaguerAPI.Models;
using leaguerAPI.Models.DTOs;
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

        public async Task<Response<TeamDTO>> CreateTeamAsync(TeamCreateDTO teamDTO, Guid leagueManagerId)
        {
            try
            {
                var canAddTeam = await _context.LeagueUsers
                                        .AnyAsync(lu => lu.UserId == leagueManagerId
                                                            && lu.LeagueId == teamDTO.LeagueId
                                                            && lu.IsManager);

                if (!canAddTeam)
                {
                    return Response<TeamDTO>.FailureResult("You do not have permission to add a team to this league");
                }

                var team = new Team
                {
                    Id = Guid.NewGuid(),
                    LeagueId = teamDTO.LeagueId,
                    Name = teamDTO.Name,
                    Wins = 0,
                    Losses = 0,
                    TeamUsers = new List<TeamUser>()
                };

                //add team managers
                if (teamDTO.TeamManagerIds.Count() > 0)
                {
                    var existingLeagueUsers = await _context.ConfirmedLeagueUsers
                    .Where(u => teamDTO.TeamManagerIds.Contains(u.UserId) && u.LeagueId == teamDTO.LeagueId)
                    .ToListAsync();

                    if (existingLeagueUsers.Count != teamDTO.TeamManagerIds.Count)
                    {
                        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");
                    }

                    foreach (var userId in teamDTO.TeamManagerIds)
                    {
                        team.TeamUsers.Add(new TeamUser
                        {
                            TeamId = team.Id,
                            UserId = userId,
                            IsManager = true
                        });
                    }
                }
                else
                {
                    return Response<TeamDTO>.FailureResult("At least one manager is required");
                }

                //add team users
                if (teamDTO.TeamUserIds != null && teamDTO.TeamUserIds.Count() > 0)
                {
                    HashSet<Guid> hashSet = new HashSet<Guid>(teamDTO.TeamManagerIds);

                    bool hasCommon = teamDTO.TeamUserIds.Any(guid => hashSet.Contains(guid));

                    if (hasCommon)
                    {
                        return Response<TeamDTO>.FailureResult("Managers cannot also be users");
                    }

                    var existingLeagueUsers = await _context.ConfirmedLeagueUsers
                    .Where(u => teamDTO.TeamUserIds.Contains(u.UserId) && u.LeagueId == teamDTO.LeagueId)
                    .ToListAsync();

                    if (existingLeagueUsers.Count != teamDTO.TeamUserIds.Count)
                    {
                        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");
                    }

                    foreach (var userId in teamDTO.TeamUserIds)
                    {
                        team.TeamUsers.Add(new TeamUser
                        {
                            TeamId = team.Id,
                            UserId = userId,
                            IsManager = false
                        });
                    }
                }

                await _context.Teams.AddAsync(team);
                await _context.SaveChangesAsync();

                return Response<TeamDTO>.SuccessResult(new TeamDTO(team));
            }
            catch (Exception ex)
            {
                // Consider logging the error in production
                return Response<TeamDTO>.FailureResult(ex.Message);
            }
        }

        public async Task<Response<TeamDTO>> UpdateTeamAsync(TeamUpdateDTO teamDTO)
        {
            try
            {
                var team = await _context.Teams.FirstOrDefaultAsync(t => t.Id == teamDTO.Id);
                if (team == null)
                {
                    return Response<TeamDTO>.FailureResult("Team not found");
                }

                team.Name = teamDTO.Name;

                if (teamDTO.TeamManagerIds.Count() > 0)
                {
                    var existingLeagueUsers = await _context.ConfirmedLeagueUsers
                    .Where(u => teamDTO.TeamManagerIds.Contains(u.UserId) && u.LeagueId == team.LeagueId)
                    .ToListAsync();

                    if (existingLeagueUsers.Count != teamDTO.TeamManagerIds.Count)
                    {
                        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");
                    }

                    foreach (var userId in teamDTO.TeamManagerIds)
                    {
                        team.TeamUsers.Add(new TeamUser
                        {
                            TeamId = team.Id,
                            UserId = userId,
                            IsManager = true
                        });
                    }
                }
                else
                {
                    return Response<TeamDTO>.FailureResult("At least one manager is required");
                }

                //add team users
                if (teamDTO.TeamUserIds != null && teamDTO.TeamUserIds.Count() > 0)
                {
                    HashSet<Guid> hashSet = new HashSet<Guid>(teamDTO.TeamManagerIds);

                    bool hasCommon = teamDTO.TeamUserIds.Any(guid => hashSet.Contains(guid));

                    if (hasCommon)
                    {
                        return Response<TeamDTO>.FailureResult("Managers cannot also be users");
                    }

                    var existingLeagueUsers = await _context.ConfirmedLeagueUsers
                    .Where(u => teamDTO.TeamUserIds.Contains(u.UserId) && u.LeagueId == team.LeagueId)
                    .ToListAsync();

                    if (existingLeagueUsers.Count != teamDTO.TeamUserIds.Count)
                    {
                        return Response<TeamDTO>.FailureResult("One or more users are not part of the league");
                    }

                    foreach (var userId in teamDTO.TeamUserIds)
                    {
                        team.TeamUsers.Add(new TeamUser
                        {
                            TeamId = team.Id,
                            UserId = userId,
                            IsManager = false
                        });
                    }
                }

                await _context.SaveChangesAsync();

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
                    .Where(t => t.LeagueId == leagueId)
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
    }
}
