using Microsoft.EntityFrameworkCore;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(OfficeBoundDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<User?> GetByUsernameWithDepartmentAsync(string username, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Include(u => u.Department)
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<List<User>> GetUnreviewedAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(u => !u.IsApproved && !u.ReviewedDate.HasValue)
            .ToListAsync(cancellationToken);
    }
}

