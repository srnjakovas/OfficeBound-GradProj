using OfficeBound.Domain.Entities;

namespace OfficeBound.Domain.Repositories;

public interface IDepartmentRepository : IRepository<Department>
{
    Task<Department?> GetByIdWithManagerAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Department>> GetAllWithManagerAsync(CancellationToken cancellationToken = default);
    Task<Department?> GetByManagerIdAsync(int managerId, CancellationToken cancellationToken = default);
}

