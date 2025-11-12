using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Enumerations;

namespace OfficeBound.Domain.Repositories;

public interface IDepartmentRepository : IRepository<Department>
{
    Task<Department?> GetByIdWithManagerAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Department>> GetAllWithManagerAsync(Role? userRole = null, CancellationToken cancellationToken = default);
    Task<Department?> GetByManagerIdAsync(int managerId, CancellationToken cancellationToken = default);
}

