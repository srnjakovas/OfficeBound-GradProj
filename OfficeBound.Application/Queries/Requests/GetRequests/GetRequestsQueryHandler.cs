using Mapster;
using MediatR;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Requests.GetRequests;

public class GetRequestsQueryHandler : IRequestHandler<GetRequestsQuery, GetRequestsResponse>
{
    private readonly IRequestRepository _requestRepository;

    public GetRequestsQueryHandler(IRequestRepository requestRepository)
    {
        _requestRepository = requestRepository;
    }
    
    public async Task<GetRequestsResponse> Handle(GetRequestsQuery request, CancellationToken cancellationToken)
    {
        var requests = await _requestRepository.GetAllAsync(cancellationToken);
        var requestsList = requests.ToList();

        return requestsList.Adapt<GetRequestsResponse>();
    }
}