using OfficeBound.Domain.Entities;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Infrastructure.Repositories;

public class RequestRepository : BaseRepository<Request>, IRequestRepository
{
    public RequestRepository(OfficeBoundDbContext context) : base(context)
    {
    }
}

