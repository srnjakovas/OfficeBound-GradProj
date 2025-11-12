using Microsoft.EntityFrameworkCore;
using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Infrastructure.Repositories;

public class RequestRepository : BaseRepository<Request>, IRequestRepository
{
    public RequestRepository(OfficeBoundDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Request>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Include(r => r.Department)
            .Include(r => r.Users)
            .ToListAsync(cancellationToken);
    }

    public override async Task<Request?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Include(r => r.Department)
            .Include(r => r.Users)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    public async Task<int> CountByTypeAndDateAsync(RequestType requestType, DateTime requestDate, CancellationToken cancellationToken = default)
    {
        var dateOnly = requestDate.Date;
        return await DbSet
            .Where(r => r.RequestType == requestType 
                && r.RequestDate.Date == dateOnly
                && (r.RequestStatus == RequestStatus.Pending || r.RequestStatus == RequestStatus.Approved))
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountByTypeAndDateExcludingIdAsync(RequestType requestType, DateTime requestDate, int excludeRequestId, CancellationToken cancellationToken = default)
    {
        var dateOnly = requestDate.Date;
        return await DbSet
            .Where(r => r.RequestType == requestType 
                && r.RequestDate.Date == dateOnly
                && r.Id != excludeRequestId
                && (r.RequestStatus == RequestStatus.Pending || r.RequestStatus == RequestStatus.Approved))
            .CountAsync(cancellationToken);
    }
}

