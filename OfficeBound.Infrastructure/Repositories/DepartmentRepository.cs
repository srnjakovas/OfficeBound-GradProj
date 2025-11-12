using Microsoft.EntityFrameworkCore;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Infrastructure.Repositories;

public class DepartmentRepository : BaseRepository<Department>, IDepartmentRepository
{
    public DepartmentRepository(OfficeBoundDbContext context) : base(context)
    {
    }

    public async Task<Department?> GetByIdWithManagerAsync(int id, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Include(d => d.Manager)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Department>> GetAllWithManagerAsync(Role? userRole = null, CancellationToken cancellationToken = default)
    {
        var query = DbSet.Include(d => d.Manager).AsQueryable();
        
        if (userRole != Role.Administrator)
        {
            query = query.Where(d => d.IsActive);
        }
        
        return await query.ToListAsync(cancellationToken);
    }

    public async Task<Department?> GetByManagerIdAsync(int managerId, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(d => d.IsActive)
            .FirstOrDefaultAsync(d => d.ManagerId == managerId, cancellationToken);
    }
}

