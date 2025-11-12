using MediatR;

namespace OfficeBound.Application.Queries.Users.HasBranchManager;

public record HasBranchManagerQuery : IRequest<bool>;

