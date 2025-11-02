using MediatR;
using OfficeBound.Contracts.Dtos;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Auth.GetUserAccountRequests;

public class GetUserAccountRequestsQueryHandler : IRequestHandler<GetUserAccountRequestsQuery, GetUserAccountRequestsResponse>
{
    private readonly IUserAccountRequestRepository _userAccountRequestRepository;

    public GetUserAccountRequestsQueryHandler(IUserAccountRequestRepository userAccountRequestRepository)
    {
        _userAccountRequestRepository = userAccountRequestRepository;
    }

    public async Task<GetUserAccountRequestsResponse> Handle(GetUserAccountRequestsQuery request, CancellationToken cancellationToken)
    {
        var unreviewedRequests = await _userAccountRequestRepository.GetUnreviewedAsync(cancellationToken);
        
        var requestDtos = unreviewedRequests.Select(r => new UserAccountRequestDto(
            r.Id,
            r.Username,
            r.IsReviewed,
            r.IsApproved,
            r.CreatedDate,
            r.ReviewedDate
        )).ToList();

        return new GetUserAccountRequestsResponse(requestDtos);
    }
}

