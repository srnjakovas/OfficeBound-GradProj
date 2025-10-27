using MediatR;
using OfficeBound.Contracts.Responses;

namespace OfficeBound.Application.Queries.Requests.GetRequestById;

public record GetRequestByIdQuery(int Id) : IRequest<GetRequestByIdResponse>;