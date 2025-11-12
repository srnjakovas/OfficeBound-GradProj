using MediatR;
using OfficeBound.Domain.Repositories;

namespace OfficeBound.Application.Queries.Users.HasBranchManager;

public class HasBranchManagerQueryHandler : IRequestHandler<HasBranchManagerQuery, bool>
{
    private readonly IUserRepository _userRepository;

    public HasBranchManagerQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(HasBranchManagerQuery request, CancellationToken cancellationToken)
    {
        return await _userRepository.HasBranchManagerAsync(cancellationToken);
    }
}

