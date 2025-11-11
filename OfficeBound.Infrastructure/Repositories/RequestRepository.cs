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

