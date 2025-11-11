using Microsoft.EntityFrameworkCore;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Infrastructure;

public class OfficeBoundDbContext : DbContext
{
    public OfficeBoundDbContext(DbContextOptions<OfficeBoundDbContext> options) : base(options)
    {
    }

    public DbSet<Request> Requests => Set<Request>();

    public DbSet<Department> Departments => Set<Department>();
    
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.Department)
            .WithMany()
            .HasForeignKey(r => r.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Department)
            .WithMany(d => d.Users)
            .HasForeignKey(u => u.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Request>()
            .HasMany(r => r.Users)
            .WithMany(u => u.Requests)
            .UsingEntity<Dictionary<string, object>>(
                "RequestUser",
                j => j.HasOne<User>().WithMany().HasForeignKey("UserId"),
                j => j.HasOne<Request>().WithMany().HasForeignKey("RequestId"),
                j =>
                {
                    j.HasKey("RequestId", "UserId");
                    j.ToTable("RequestUsers");
                });
    }
}