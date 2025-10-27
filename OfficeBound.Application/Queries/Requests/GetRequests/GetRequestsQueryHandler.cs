using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OfficeBound.Contracts.Responses;
using OfficeBound.Infrastructure;

namespace OfficeBound.Application.Queries.Requests.GetRequests;

public class GetRequestsQueryHandler : IRequestHandler<GetRequestsQuery, GetRequestsResponse>
{
    private readonly OfficeBoundDbContext _officeBoundDbContext;

    public GetRequestsQueryHandler(OfficeBoundDbContext officeBoundDbContext)
    {
        _officeBoundDbContext = officeBoundDbContext;
    }
    
    public async Task<GetRequestsResponse> Handle(GetRequestsQuery request, CancellationToken cancellationToken)
    {
        var requests = await _officeBoundDbContext.Requests.ToListAsync(cancellationToken);

        return requests.Adapt<GetRequestsResponse>();
    }
}