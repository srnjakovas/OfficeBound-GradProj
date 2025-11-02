using Microsoft.EntityFrameworkCore;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Infrastructure.Repositories;

public class UserAccountRequestRepository : BaseRepository<UserAccountRequest>, IUserAccountRequestRepository
{
    public UserAccountRequestRepository(OfficeBoundDbContext context) : base(context)
    {
    }

    public async Task<List<UserAccountRequest>> GetUnreviewedAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(uar => !uar.IsReviewed)
            .ToListAsync(cancellationToken);
    }
}

