using leaguerAPI.Models;
using leaguerAPI.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace leaguerAPI.Database
{
    public class LeaguerDbContext : DbContext
    {
        public LeaguerDbContext(DbContextOptions<LeaguerDbContext> options)
            : base(options)
        {
        }

        public DbSet<League> Leagues { get; set; }
        public DbSet<LeagueUser> LeagueUsers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Sport> Sports { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventResult> EventResults { get; set; }
        public DbSet<EventUser> EventUsers { get; set; }
        public DbSet<EventTeam> EventTeams { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamUser> TeamUsers { get; set; }
        public DbSet<TeamLeague> TeamLeagues { get; set; }
        public DbSet<Match> Matches { get; set; }
        public IQueryable<LeagueUser> ConfirmedLeagueUsers =>
            LeagueUsers.Where(lu => lu.Status == LeagueUserStatus.Member);
        public IQueryable<LeagueUser> LeagueUserInvites =>
            LeagueUsers.Where(lu => lu.Status == LeagueUserStatus.Invited);
        public IQueryable<LeagueUser> LeagueUserRequestsAndInvites =>
                                LeagueUsers.Where(lu => lu.Status == LeagueUserStatus.Requested
                                || lu.Status == LeagueUserStatus.Invited);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<League>(entity =>
            {
                entity.HasKey(l => l.Id);

                entity.Property(l => l.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(l => l.Sport)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(l => l.CreatedDate)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAdd();

                entity.Property(l => l.ModifiedDate)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(l => l.isPublic)
                    .HasDefaultValue(false);

                entity.Property(l => l.isCompetitive)
                    .HasDefaultValue(false);

                entity.Property(l => l.IsTeamLeague)
                    .HasDefaultValue(false);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<LeagueUser>(entity =>
            {
                entity.HasKey(lu => new { lu.UserId, lu.LeagueId });
                entity.Property(lu => lu.IsManager).HasDefaultValue(false);

                entity.HasOne(lu => lu.User)
                    .WithMany(u => u.LeagueUsers)
                    .HasForeignKey(lu => lu.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(lu => lu.League)
                    .WithMany(l => l.LeagueUsers)
                    .HasForeignKey(lu => lu.LeagueId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(lu => lu.IsDeleted)
                    .HasDefaultValue(false);

                entity.Property(lu => lu.Status)
                    .HasConversion<int>()
                    .IsRequired();

                entity.ToTable("LeagueUsers", tb =>
                    tb.HasCheckConstraint("CK_LeagueUsers_Status", "\"Status\" BETWEEN 0 AND 4"));

                entity.HasIndex(lu => lu.Status)
                    .HasDatabaseName("IX_LeagueUsers_Status");

                entity.HasQueryFilter(lu => !lu.IsDeleted);

                entity.HasIndex(lu => lu.IsDeleted)
                    .HasDatabaseName("IX_LeagueUsers_IsDeleted");
            });

            modelBuilder.Entity<Sport>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Name).IsRequired().HasMaxLength(100);
                entity.Property(s => s.IsTeamSport).IsRequired();
                entity.Property(s => s.Description).HasMaxLength(500);
            });

            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.EventTime).IsRequired();
                entity.Property(e => e.Location).IsRequired();
                entity.Property(e => e.Createdby).IsRequired();
                entity.Property(e => e.IsTeamEvent).IsRequired();

                entity.Property(e => e.EventType)
                    .HasConversion<int>()
                    .IsRequired();

                entity.ToTable("Events", tb =>
                    tb.HasCheckConstraint("CK_Events_EventType", "\"EventType\" BETWEEN 0 AND 3"));

                entity.HasIndex(lu => lu.EventType)
                    .HasDatabaseName("IX_Events_EventType");

                entity.ToTable("Events", tb =>
                   tb.HasCheckConstraint("CK_Events_JoinType", "\"JoinType\" BETWEEN 0 AND 3"));

                entity.HasIndex(lu => lu.EventType)
                    .HasDatabaseName("IX_Events_JoinType");

                entity.HasOne(e => e.League)
                    .WithMany(l => l.Events)
                    .HasForeignKey(e => e.LeagueId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany(u => u.Events)
                    .HasForeignKey(e => e.Createdby)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<EventResult>(entity =>
            {
                entity.HasKey(er => er.Id);

                entity.Property(er => er.Score).HasMaxLength(50);

                entity.HasOne(er => er.Event)
                    .WithOne(e => e.EventResult)
                    .HasForeignKey<EventResult>(er => er.EventId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(er => er.WinningTeam)
                    .WithMany()
                    .HasForeignKey(er => er.WinningTeamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(er => er.WinningUser)
                    .WithMany()
                    .HasForeignKey(er => er.WinningUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(er => er.LosingTeam)
                    .WithMany()
                    .HasForeignKey(er => er.LosingTeamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(er => er.LosingUser)
                    .WithMany()
                    .HasForeignKey(er => er.LosingUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(er => er.StarPlayerUser)
                    .WithMany()
                    .HasForeignKey(er => er.StarPlayerUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<EventUser>(entity =>
            {
                entity.HasKey(eu => new { eu.UserId, eu.EventId });

                entity.HasOne(eu => eu.User)
                    .WithMany(u => u.EventUsers)
                    .HasForeignKey(eu => eu.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(eu => eu.Event)
                    .WithMany(e => e.EventUsers)
                    .HasForeignKey(eu => eu.EventId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<EventTeam>(entity =>
            {
                entity.HasKey(et => new { et.EventId, et.TeamId });

                entity.HasOne(et => et.Event)
                    .WithMany(e => e.EventTeams)
                    .HasForeignKey(et => et.EventId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(et => et.Team)
                    .WithMany(t => t.EventTeams)
                    .HasForeignKey(et => et.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Name).IsRequired().HasMaxLength(100);
                entity.Property(t => t.Wins).HasDefaultValue(0);
                entity.Property(t => t.Losses).HasDefaultValue(0);
                entity.Property(t => t.IsPending).HasDefaultValue(false);
            });

            modelBuilder.Entity<TeamUser>(entity =>
            {
                entity.HasKey(tu => new { tu.TeamId, tu.UserId });

                entity.HasOne(tu => tu.Team)
                    .WithMany(t => t.TeamUsers)
                    .HasForeignKey(tu => tu.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(tu => tu.User)
                    .WithMany(u => u.TeamUsers)
                    .HasForeignKey(tu => tu.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(lu => lu.Status)
                    .HasConversion<int>()
                    .IsRequired();

                entity.ToTable("TeamUsers", tb =>
                    tb.HasCheckConstraint("CK_TeamUsers_Status", "\"Status\" BETWEEN 0 AND 4"));

                entity.HasIndex(lu => lu.Status)
                    .HasDatabaseName("IX_TeamUsers_Status");

                entity.HasQueryFilter(lu => !lu.IsDeleted);

                entity.HasIndex(lu => lu.IsDeleted)
                    .HasDatabaseName("IX_TeamUsers_IsDeleted");
            });

            modelBuilder.Entity<TeamLeague>(entity =>
            {
                entity.HasKey(tl => new { tl.TeamId, tl.LeagueId });

                entity.HasOne(tl => tl.Team)
                    .WithMany(t => t.TeamLeagues)
                    .HasForeignKey(tl => tl.TeamId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(tl => tl.League)
                    .WithMany(l => l.TeamLeagues)
                    .HasForeignKey(tl => tl.LeagueId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Match>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Opponent1Id).IsRequired();
                entity.Property(m => m.Opponent2Id).IsRequired();
                entity.Property(m => m.Round).IsRequired();
                entity.Property(m => m.MatchNumber).IsRequired();

                modelBuilder.Entity<Match>()
                    .Property(e => e.MatchResult)
                    .HasColumnType("jsonb");

                entity.HasOne(m => m.Event)
                    .WithMany(e => e.Matches)
                    .HasForeignKey(m => m.EventId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}