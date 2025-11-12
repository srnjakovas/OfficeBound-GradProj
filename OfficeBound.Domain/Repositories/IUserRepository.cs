using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Domain.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User?> GetByUsernameWithDepartmentAsync(string username, CancellationToken cancellationToken = default);
    Task<List<User>> GetUnreviewedAsync(CancellationToken cancellationToken = default);
    Task<bool> HasBranchManagerAsync(CancellationToken cancellationToken = default);
}

