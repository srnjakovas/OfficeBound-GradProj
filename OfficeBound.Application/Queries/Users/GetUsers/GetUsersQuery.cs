using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.Users.GetUsers;

public record GetUsersQuery : IRequest<GetUsersResponse>;

