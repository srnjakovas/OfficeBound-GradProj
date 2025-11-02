using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.Auth.GetUserAccountRequests;

public record GetUserAccountRequestsQuery() : IRequest<GetUserAccountRequestsResponse>;

