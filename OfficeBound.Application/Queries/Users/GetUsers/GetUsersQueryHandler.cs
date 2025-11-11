using Mapster;
using MediatR;
using OfficeBound.Contracts.Responses;
using OfficeBound.Domain.Enumerations;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Users.GetUsers;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, GetUsersResponse>
{
    private readonly IUserRepository _userRepository;

    public GetUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<GetUsersResponse> Handle(GetUsersQuery query, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);
        var usersList = users.Where(u => u.IsApproved && u.Role == Role.User).ToList();

        return usersList.Adapt<GetUsersResponse>();
    }
}

