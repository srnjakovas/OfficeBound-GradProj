using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using OfficeBound.Contracts.Exceptions;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Entities;
using OfficeBound.Infrastructure;

namespace OfficeBound.Application.Queries.Requests.GetRequestById;

public class GetRequestByIdQueryHandler : IRequestHandler<GetRequestByIdQuery, GetRequestByIdResponse>
{
    private readonly OfficeBoundDbContext _officeBoundDbContext;
    
    public GetRequestByIdQueryHandler(OfficeBoundDbContext officeBoundDbContext)
    {
        _officeBoundDbContext = officeBoundDbContext;
    }
    
    public async Task<GetRequestByIdResponse> Handle(GetRequestByIdQuery request, CancellationToken cancellationToken)
    {
        var requestById =
            await _officeBoundDbContext.Requests.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        return requestById is null
            ? throw new NotFoundException($"{nameof(Request)} with Id: {request.Id} was not found to Database)")
            : requestById.Adapt<GetRequestByIdResponse>();
    }
}