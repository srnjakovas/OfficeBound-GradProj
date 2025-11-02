using OfficeBound.Domain.Entities;

namespace OfficeBound.Domain.Repositories;

public interface IUserAccountRequestRepository : IRepository<UserAccountRequest>
{
    Task<List<UserAccountRequest>> GetUnreviewedAsync(CancellationToken cancellationToken = default);
}

