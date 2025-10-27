using Microsoft.EntityFrameworkCore;
using OfficeBound.Domain.Entities;

namespace OfficeBound.Infrastructure;

public class OfficeBoundDbContext : DbContext
{
    public OfficeBoundDbContext(DbContextOptions<OfficeBoundDbContext> options) : base(options)
    {
    }

    
    public DbSet<Request> Requests => Set<Request>();
}