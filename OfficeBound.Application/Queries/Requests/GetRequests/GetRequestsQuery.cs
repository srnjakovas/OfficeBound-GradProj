using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.Requests.GetRequests;

public record GetRequestsQuery() : IRequest<GetRequestsResponse>;