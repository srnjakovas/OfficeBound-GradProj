using OfficeBound.Domain.Entities;

namespace OfficeBound.Domain.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User?> GetByUsernameWithDepartmentAsync(string username, CancellationToken cancellationToken = default);
}

