using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Domain.Repositories;

public interface IRequestRepository : IRepository<Request>
{
    Task<int> CountByTypeAndDateAsync(RequestType requestType, DateTime requestDate, CancellationToken cancellationToken = default);
    Task<int> CountByTypeAndDateExcludingIdAsync(RequestType requestType, DateTime requestDate, int excludeRequestId, CancellationToken cancellationToken = default);
}

