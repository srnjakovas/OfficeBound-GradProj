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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.Department)
            .WithMany()
            .HasForeignKey(r => r.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}