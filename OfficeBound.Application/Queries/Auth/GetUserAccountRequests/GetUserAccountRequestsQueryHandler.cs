using MediatR;
using OfficeBound.Contracts.Dtos;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Auth.GetUserAccountRequests;

public class GetUserAccountRequestsQueryHandler : IRequestHandler<GetUserAccountRequestsQuery, GetUserAccountRequestsResponse>
{
    private readonly IUserRepository _userRepository;

    public GetUserAccountRequestsQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<GetUserAccountRequestsResponse> Handle(GetUserAccountRequestsQuery request, CancellationToken cancellationToken)
    {
        var unreviewedUsers = await _userRepository.GetUnreviewedAsync(cancellationToken);
        
        var requestDtos = unreviewedUsers.Select(u => new UserAccountRequestDto(
            u.Id,
            u.Username,
            u.ReviewedDate.HasValue,
            u.IsApproved,
            u.CreatedDate,
            u.ReviewedDate
        )).ToList();

        return new GetUserAccountRequestsResponse(requestDtos);
    }
}

